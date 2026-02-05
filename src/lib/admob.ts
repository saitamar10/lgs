import { AdMob, RewardAdPluginEvents, RewardItem } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// AdMob Rewarded Ad Unit IDs
const REWARDED_AD_UNIT_IDS = {
  android: 'ca-app-pub-7677556382140668/REWARDED_UNIT_ID', // Bu ID'yi AdMob konsolundan alın
  ios: 'ca-app-pub-7677556382140668/REWARDED_UNIT_ID'     // Bu ID'yi AdMob konsolundan alın
};

// Test Ad Unit IDs (Development için)
const TEST_REWARDED_AD_UNIT_IDS = {
  android: 'ca-app-pub-3940256099942544/5224354917',
  ios: 'ca-app-pub-3940256099942544/1712485313'
};

class AdMobService {
  private isInitialized = false;
  private isAdLoaded = false;
  private useTestAds = false; // Production'da false yapın

  async initialize() {
    if (this.isInitialized) return;

    // Sadece native platformlarda çalışır
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob is only available on native platforms');
      return;
    }

    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: this.useTestAds,
      });

      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
      throw error;
    }
  }

  private getRewardedAdUnitId(): string {
    const platform = Capacitor.getPlatform();

    if (this.useTestAds) {
      return platform === 'ios'
        ? TEST_REWARDED_AD_UNIT_IDS.ios
        : TEST_REWARDED_AD_UNIT_IDS.android;
    }

    return platform === 'ios'
      ? REWARDED_AD_UNIT_IDS.ios
      : REWARDED_AD_UNIT_IDS.android;
  }

  async prepareRewardedAd(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('AdMob is only available on native platforms');
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const adUnitId = this.getRewardedAdUnitId();

      await AdMob.prepareRewardedVideoAd({
        adId: adUnitId,
        npa: false // Non-personalized ads (GDPR uyumluluğu için)
      });

      this.isAdLoaded = true;
      console.log('Rewarded ad loaded successfully');
    } catch (error) {
      console.error('Failed to load rewarded ad:', error);
      this.isAdLoaded = false;
      throw error;
    }
  }

  async showRewardedAd(): Promise<RewardItem> {
    if (!Capacitor.isNativePlatform()) {
      // Web platformda simüle et
      console.log('Simulating rewarded ad on web platform');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ type: 'coins', amount: 1 });
        }, 3000);
      });
    }

    if (!this.isAdLoaded) {
      await this.prepareRewardedAd();
    }

    return new Promise((resolve, reject) => {
      let rewardReceived = false;

      // Ödül alındığında tetiklenir
      AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: RewardItem) => {
        console.log('User earned reward:', reward);
        rewardReceived = true;
        resolve(reward);
      });

      // Reklam kapatıldığında tetiklenir
      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        console.log('Rewarded ad dismissed');
        this.isAdLoaded = false;

        if (!rewardReceived) {
          reject(new Error('Ad dismissed without reward'));
        }

        // Listener'ları temizle
        AdMob.removeAllListeners();

        // Bir sonraki reklam için hazırla
        this.prepareRewardedAd().catch(console.error);
      });

      // Reklam gösterilemezse
      AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error) => {
        console.error('Failed to show rewarded ad:', error);
        this.isAdLoaded = false;
        AdMob.removeAllListeners();
        reject(new Error('Failed to show ad'));
      });

      // Reklamı göster
      AdMob.showRewardedVideoAd().catch((error) => {
        console.error('Error showing rewarded ad:', error);
        AdMob.removeAllListeners();
        reject(error);
      });
    });
  }

  isAvailable(): boolean {
    return Capacitor.isNativePlatform() && this.isInitialized;
  }

  async preloadAd(): Promise<void> {
    try {
      await this.prepareRewardedAd();
    } catch (error) {
      console.error('Failed to preload ad:', error);
    }
  }
}

export const admobService = new AdMobService();
