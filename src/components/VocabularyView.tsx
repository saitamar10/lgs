import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, BookOpen, Volume2, Check, X, Gamepad2, Trophy, Info, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUpdateTaskProgress, useDailyTasks } from '@/hooks/useDailyTasks';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface Word {
  id: string;
  english: string;
  turkish: string;
  example: string;
  level: 'A1' | 'A2' | 'B1';
  unit: number;
  learned: boolean;
}

const UNIT_NAMES: Record<number, string> = {
  1: 'Friendship',
  2: 'Teen Life',
  3: 'Cooking',
  4: 'Communication',
  5: 'The Internet',
  6: 'Adventures',
  7: 'Tourism',
  8: 'Chores',
  9: 'Science',
  10: 'Natural Forces',
};

// 8. Sınıf İngilizce Müfredatı - Ünite Bazlı Kelimeler
const INITIAL_WORDS: Word[] = [
  // ===== UNIT 1: FRIENDSHIP =====
  { id: 'u1-1', english: 'friendship', turkish: 'arkadaşlık', example: 'Friendship is very important in life.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-2', english: 'buddy', turkish: 'yakın arkadaş', example: 'He is my best buddy.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-3', english: 'count on', turkish: 'güvenmek', example: 'You can always count on me.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-4', english: 'trust', turkish: 'güvenmek', example: 'I trust my best friend.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-5', english: 'loyal', turkish: 'sadık', example: 'A loyal friend never leaves you.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-6', english: 'honest', turkish: 'dürüst', example: 'She is an honest person.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-7', english: 'supportive', turkish: 'destekleyici', example: 'My friends are very supportive.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-8', english: 'caring', turkish: 'ilgili, şefkatli', example: 'She is a caring friend.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-9', english: 'generous', turkish: 'cömert', example: 'He is generous with his time.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-10', english: 'selfish', turkish: 'bencil', example: 'A selfish person only thinks about himself.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-11', english: 'jealous', turkish: 'kıskanç', example: 'Don\'t be jealous of others.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-12', english: 'arrogant', turkish: 'kibirli', example: 'Nobody likes an arrogant person.', level: 'B1', unit: 1, learned: false },
  { id: 'u1-13', english: 'stubborn', turkish: 'inatçı', example: 'He is too stubborn to change his mind.', level: 'B1', unit: 1, learned: false },
  { id: 'u1-14', english: 'reliable', turkish: 'güvenilir', example: 'She is a reliable person.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-15', english: 'apologize', turkish: 'özür dilemek', example: 'You should apologize for your mistake.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-16', english: 'back up', turkish: 'desteklemek', example: 'Real friends always back you up.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-17', english: 'get on well', turkish: 'iyi geçinmek', example: 'I get on well with my classmates.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-18', english: 'hang out', turkish: 'takılmak', example: 'We hang out at the park after school.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-19', english: 'have in common', turkish: 'ortak noktası olmak', example: 'We have a lot in common.', level: 'A2', unit: 1, learned: false },
  { id: 'u1-20', english: 'share', turkish: 'paylaşmak', example: 'Good friends share everything.', level: 'A1', unit: 1, learned: false },

  // ===== UNIT 2: TEEN LIFE =====
  { id: 'u2-1', english: 'teenager', turkish: 'ergen', example: 'Teenagers like spending time with friends.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-2', english: 'prefer', turkish: 'tercih etmek', example: 'I prefer reading to watching TV.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-3', english: 'attend', turkish: 'katılmak', example: 'I attend a music course.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-4', english: 'hardly ever', turkish: 'neredeyse hiç', example: 'I hardly ever eat junk food.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-5', english: 'spare time', turkish: 'boş zaman', example: 'I read books in my spare time.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-6', english: 'schedule', turkish: 'program, takvim', example: 'I have a busy schedule today.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-7', english: 'habit', turkish: 'alışkanlık', example: 'Reading is a good habit.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-8', english: 'activity', turkish: 'aktivite', example: 'Swimming is my favorite activity.', level: 'A1', unit: 2, learned: false },
  { id: 'u2-9', english: 'join', turkish: 'katılmak', example: 'Would you like to join us?', level: 'A2', unit: 2, learned: false },
  { id: 'u2-10', english: 'practice', turkish: 'pratik yapmak', example: 'I practice playing guitar every day.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-11', english: 'online', turkish: 'çevrimiçi', example: 'I take online courses.', level: 'A1', unit: 2, learned: false },
  { id: 'u2-12', english: 'social media', turkish: 'sosyal medya', example: 'Teens spend too much time on social media.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-13', english: 'interest', turkish: 'ilgi', example: 'I have an interest in science.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-14', english: 'challenge', turkish: 'meydan okuma', example: 'Learning a new language is a challenge.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-15', english: 'enjoy', turkish: 'eğlenmek', example: 'I enjoy playing basketball.', level: 'A1', unit: 2, learned: false },
  { id: 'u2-16', english: 'boring', turkish: 'sıkıcı', example: 'This movie is very boring.', level: 'A1', unit: 2, learned: false },
  { id: 'u2-17', english: 'exciting', turkish: 'heyecanlı', example: 'The match was very exciting.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-18', english: 'usually', turkish: 'genellikle', example: 'I usually wake up at 7 am.', level: 'A1', unit: 2, learned: false },
  { id: 'u2-19', english: 'routine', turkish: 'rutin', example: 'My daily routine starts early.', level: 'A2', unit: 2, learned: false },
  { id: 'u2-20', english: 'outdoor', turkish: 'açık hava', example: 'I love outdoor activities.', level: 'A2', unit: 2, learned: false },

  // ===== UNIT 3: COOKING =====
  { id: 'u3-1', english: 'ingredient', turkish: 'malzeme', example: 'We need fresh ingredients for the salad.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-2', english: 'recipe', turkish: 'tarif', example: 'This is my grandmother\'s recipe.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-3', english: 'boil', turkish: 'kaynatmak', example: 'Boil the water first.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-4', english: 'fry', turkish: 'kızartmak', example: 'Fry the onions in butter.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-5', english: 'bake', turkish: 'fırında pişirmek', example: 'Bake the cake for 30 minutes.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-6', english: 'stir', turkish: 'karıştırmak', example: 'Stir the soup slowly.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-7', english: 'chop', turkish: 'doğramak', example: 'Chop the vegetables finely.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-8', english: 'slice', turkish: 'dilimlemek', example: 'Slice the bread thinly.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-9', english: 'peel', turkish: 'soymak (kabuk)', example: 'Peel the potatoes before cooking.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-10', english: 'pour', turkish: 'dökmek', example: 'Pour the milk into the bowl.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-11', english: 'mix', turkish: 'karıştırmak', example: 'Mix the flour and eggs together.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-12', english: 'add', turkish: 'eklemek', example: 'Add some salt and pepper.', level: 'A1', unit: 3, learned: false },
  { id: 'u3-13', english: 'delicious', turkish: 'lezzetli', example: 'This meal is delicious!', level: 'A1', unit: 3, learned: false },
  { id: 'u3-14', english: 'tasty', turkish: 'lezzetli', example: 'The soup is very tasty.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-15', english: 'spicy', turkish: 'baharatlı', example: 'I don\'t like spicy food.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-16', english: 'sour', turkish: 'ekşi', example: 'Lemons taste sour.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-17', english: 'bitter', turkish: 'acı', example: 'This coffee is too bitter.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-18', english: 'roast', turkish: 'kızartmak (fırında)', example: 'Roast the chicken for an hour.', level: 'A2', unit: 3, learned: false },
  { id: 'u3-19', english: 'grate', turkish: 'rendelemek', example: 'Grate the cheese on top.', level: 'B1', unit: 3, learned: false },
  { id: 'u3-20', english: 'serve', turkish: 'servis etmek', example: 'Serve the dish hot.', level: 'A2', unit: 3, learned: false },

  // ===== UNIT 4: COMMUNICATION =====
  { id: 'u4-1', english: 'communicate', turkish: 'iletişim kurmak', example: 'We communicate by phone.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-2', english: 'conversation', turkish: 'konuşma', example: 'We had a long conversation.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-3', english: 'message', turkish: 'mesaj', example: 'I sent you a message.', level: 'A1', unit: 4, learned: false },
  { id: 'u4-4', english: 'contact', turkish: 'iletişime geçmek', example: 'You can contact me anytime.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-5', english: 'express', turkish: 'ifade etmek', example: 'It\'s important to express your feelings.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-6', english: 'body language', turkish: 'beden dili', example: 'Body language is important in communication.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-7', english: 'gesture', turkish: 'el hareketi, jest', example: 'He made a friendly gesture.', level: 'B1', unit: 4, learned: false },
  { id: 'u4-8', english: 'nod', turkish: 'başını sallamak (evet)', example: 'She nodded to say yes.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-9', english: 'refuse', turkish: 'reddetmek', example: 'He refused my invitation.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-10', english: 'accept', turkish: 'kabul etmek', example: 'She accepted the offer.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-11', english: 'apologize', turkish: 'özür dilemek', example: 'I apologize for being late.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-12', english: 'interrupt', turkish: 'sözünü kesmek', example: 'Don\'t interrupt when someone is talking.', level: 'B1', unit: 4, learned: false },
  { id: 'u4-13', english: 'polite', turkish: 'kibar', example: 'Always be polite to others.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-14', english: 'rude', turkish: 'kaba', example: 'It\'s rude to shout at people.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-15', english: 'explain', turkish: 'açıklamak', example: 'Can you explain this to me?', level: 'A2', unit: 4, learned: false },
  { id: 'u4-16', english: 'argue', turkish: 'tartışmak', example: 'They always argue about everything.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-17', english: 'agree', turkish: 'katılmak, aynı fikirde olmak', example: 'I agree with you.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-18', english: 'disagree', turkish: 'katılmamak', example: 'I disagree with that idea.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-19', english: 'suggestion', turkish: 'öneri', example: 'Thank you for your suggestion.', level: 'A2', unit: 4, learned: false },
  { id: 'u4-20', english: 'opinion', turkish: 'görüş, fikir', example: 'In my opinion, this is wrong.', level: 'A2', unit: 4, learned: false },

  // ===== UNIT 5: THE INTERNET =====
  { id: 'u5-1', english: 'access', turkish: 'erişim, erişmek', example: 'I can access the internet from my phone.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-2', english: 'download', turkish: 'indirmek', example: 'I downloaded a new app.', level: 'A1', unit: 5, learned: false },
  { id: 'u5-3', english: 'upload', turkish: 'yüklemek', example: 'She uploaded her photos.', level: 'A1', unit: 5, learned: false },
  { id: 'u5-4', english: 'search', turkish: 'aramak', example: 'I search for information online.', level: 'A1', unit: 5, learned: false },
  { id: 'u5-5', english: 'browse', turkish: 'göz atmak', example: 'I browse the internet every evening.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-6', english: 'website', turkish: 'web sitesi', example: 'Visit our website for more info.', level: 'A1', unit: 5, learned: false },
  { id: 'u5-7', english: 'password', turkish: 'şifre', example: 'Don\'t share your password.', level: 'A1', unit: 5, learned: false },
  { id: 'u5-8', english: 'log in', turkish: 'giriş yapmak', example: 'Log in to your account.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-9', english: 'log out', turkish: 'çıkış yapmak', example: 'Always log out after using the computer.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-10', english: 'account', turkish: 'hesap', example: 'I created a new email account.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-11', english: 'click', turkish: 'tıklamak', example: 'Click the link to open it.', level: 'A1', unit: 5, learned: false },
  { id: 'u5-12', english: 'share', turkish: 'paylaşmak', example: 'She shared a post on social media.', level: 'A1', unit: 5, learned: false },
  { id: 'u5-13', english: 'cyberbullying', turkish: 'siber zorbalık', example: 'Cyberbullying is a serious problem.', level: 'B1', unit: 5, learned: false },
  { id: 'u5-14', english: 'privacy', turkish: 'gizlilik', example: 'Protect your privacy online.', level: 'B1', unit: 5, learned: false },
  { id: 'u5-15', english: 'virus', turkish: 'virüs', example: 'My computer has a virus.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-16', english: 'update', turkish: 'güncellemek', example: 'You should update your software.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-17', english: 'connect', turkish: 'bağlanmak', example: 'Connect to the Wi-Fi network.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-18', english: 'online shopping', turkish: 'internet alışverişi', example: 'Online shopping is very popular.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-19', english: 'blog', turkish: 'blog', example: 'I write a blog about technology.', level: 'A2', unit: 5, learned: false },
  { id: 'u5-20', english: 'digital', turkish: 'dijital', example: 'We live in a digital world.', level: 'A2', unit: 5, learned: false },

  // ===== UNIT 6: ADVENTURES =====
  { id: 'u6-1', english: 'adventure', turkish: 'macera', example: 'Life is an adventure.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-2', english: 'explore', turkish: 'keşfetmek', example: 'I want to explore the world.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-3', english: 'discover', turkish: 'keşfetmek, bulmak', example: 'Columbus discovered America.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-4', english: 'climb', turkish: 'tırmanmak', example: 'We climbed the mountain.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-5', english: 'cave', turkish: 'mağara', example: 'We found a cave in the forest.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-6', english: 'trail', turkish: 'patika', example: 'We followed the trail in the woods.', level: 'B1', unit: 6, learned: false },
  { id: 'u6-7', english: 'camping', turkish: 'kamp yapma', example: 'We went camping last weekend.', level: 'A1', unit: 6, learned: false },
  { id: 'u6-8', english: 'backpack', turkish: 'sırt çantası', example: 'Pack your backpack for the trip.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-9', english: 'compass', turkish: 'pusula', example: 'Use a compass to find your way.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-10', english: 'survive', turkish: 'hayatta kalmak', example: 'He survived the storm.', level: 'B1', unit: 6, learned: false },
  { id: 'u6-11', english: 'bungee jumping', turkish: 'bungee atlayışı', example: 'Bungee jumping is very exciting.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-12', english: 'rafting', turkish: 'rafting', example: 'We went rafting on the river.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-13', english: 'scary', turkish: 'korkutucu', example: 'The dark cave was scary.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-14', english: 'brave', turkish: 'cesur', example: 'She is a brave girl.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-15', english: 'dangerous', turkish: 'tehlikeli', example: 'Mountain climbing can be dangerous.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-16', english: 'experience', turkish: 'deneyim', example: 'It was an amazing experience.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-17', english: 'expedition', turkish: 'keşif gezisi', example: 'They went on an expedition to the jungle.', level: 'B1', unit: 6, learned: false },
  { id: 'u6-18', english: 'parachute', turkish: 'paraşüt', example: 'He jumped with a parachute.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-19', english: 'challenge', turkish: 'meydan okuma', example: 'Climbing Everest is a big challenge.', level: 'A2', unit: 6, learned: false },
  { id: 'u6-20', english: 'rescue', turkish: 'kurtarmak', example: 'The team rescued the climbers.', level: 'A2', unit: 6, learned: false },

  // ===== UNIT 7: TOURISM =====
  { id: 'u7-1', english: 'tourist', turkish: 'turist', example: 'Many tourists visit Istanbul.', level: 'A1', unit: 7, learned: false },
  { id: 'u7-2', english: 'sightseeing', turkish: 'gezi, tur', example: 'We went sightseeing in Rome.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-3', english: 'destination', turkish: 'gidilecek yer', example: 'Paris is a popular destination.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-4', english: 'accommodation', turkish: 'konaklama', example: 'We booked accommodation near the beach.', level: 'B1', unit: 7, learned: false },
  { id: 'u7-5', english: 'reservation', turkish: 'rezervasyon', example: 'I made a hotel reservation.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-6', english: 'flight', turkish: 'uçuş', example: 'Our flight is at 8 am.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-7', english: 'luggage', turkish: 'bagaj', example: 'Don\'t forget your luggage.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-8', english: 'passport', turkish: 'pasaport', example: 'You need a passport to travel abroad.', level: 'A1', unit: 7, learned: false },
  { id: 'u7-9', english: 'guidebook', turkish: 'gezi rehberi', example: 'Buy a guidebook before the trip.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-10', english: 'monument', turkish: 'anıt', example: 'We visited a famous monument.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-11', english: 'historical', turkish: 'tarihi', example: 'This is a historical place.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-12', english: 'ancient', turkish: 'antik, eski', example: 'Ancient ruins are fascinating.', level: 'B1', unit: 7, learned: false },
  { id: 'u7-13', english: 'scenery', turkish: 'manzara', example: 'The scenery is breathtaking.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-14', english: 'souvenir', turkish: 'hatıra, hediyelik eşya', example: 'I bought a souvenir for my mom.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-15', english: 'abroad', turkish: 'yurt dışı', example: 'Have you ever been abroad?', level: 'A2', unit: 7, learned: false },
  { id: 'u7-16', english: 'currency', turkish: 'para birimi', example: 'What is the local currency?', level: 'B1', unit: 7, learned: false },
  { id: 'u7-17', english: 'customs', turkish: 'gümrük', example: 'We passed through customs quickly.', level: 'B1', unit: 7, learned: false },
  { id: 'u7-18', english: 'embassy', turkish: 'büyükelçilik', example: 'Go to the embassy for your visa.', level: 'B1', unit: 7, learned: false },
  { id: 'u7-19', english: 'brochure', turkish: 'broşür', example: 'I picked up a travel brochure.', level: 'A2', unit: 7, learned: false },
  { id: 'u7-20', english: 'itinerary', turkish: 'seyahat planı', example: 'Check the itinerary for tomorrow.', level: 'B1', unit: 7, learned: false },

  // ===== UNIT 8: CHORES =====
  { id: 'u8-1', english: 'chore', turkish: 'ev işi', example: 'Doing chores is everyone\'s responsibility.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-2', english: 'vacuum', turkish: 'süpürmek (elektrikli)', example: 'I vacuum the living room.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-3', english: 'sweep', turkish: 'süpürmek', example: 'Sweep the kitchen floor.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-4', english: 'mop', turkish: 'paspas yapmak', example: 'Mop the floor after sweeping.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-5', english: 'do the laundry', turkish: 'çamaşır yıkamak', example: 'I do the laundry on weekends.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-6', english: 'iron', turkish: 'ütü yapmak', example: 'I iron my school uniform.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-7', english: 'do the dishes', turkish: 'bulaşık yıkamak', example: 'It\'s your turn to do the dishes.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-8', english: 'take out the trash', turkish: 'çöpü çıkarmak', example: 'Please take out the trash.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-9', english: 'tidy up', turkish: 'toplamak, düzenlemek', example: 'Tidy up your room before bed.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-10', english: 'dust', turkish: 'toz almak', example: 'I dust the furniture every week.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-11', english: 'set the table', turkish: 'sofra kurmak', example: 'Can you set the table for dinner?', level: 'A2', unit: 8, learned: false },
  { id: 'u8-12', english: 'clear the table', turkish: 'sofrayı toplamak', example: 'Clear the table after eating.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-13', english: 'feed', turkish: 'beslemek', example: 'I feed the cat every morning.', level: 'A1', unit: 8, learned: false },
  { id: 'u8-14', english: 'water the plants', turkish: 'çiçekleri sulamak', example: 'Don\'t forget to water the plants.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-15', english: 'make the bed', turkish: 'yatak yapmak', example: 'I make my bed every morning.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-16', english: 'hang up', turkish: 'asmak (çamaşır)', example: 'Hang up the clothes to dry.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-17', english: 'responsibility', turkish: 'sorumluluk', example: 'It\'s our responsibility to help at home.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-18', english: 'messy', turkish: 'dağınık', example: 'Your room is so messy!', level: 'A2', unit: 8, learned: false },
  { id: 'u8-19', english: 'neat', turkish: 'düzenli, temiz', example: 'Keep your desk neat.', level: 'A2', unit: 8, learned: false },
  { id: 'u8-20', english: 'grocery shopping', turkish: 'market alışverişi', example: 'I go grocery shopping with my mom.', level: 'A2', unit: 8, learned: false },

  // ===== UNIT 9: SCIENCE =====
  { id: 'u9-1', english: 'science', turkish: 'bilim', example: 'Science helps us understand the world.', level: 'A1', unit: 9, learned: false },
  { id: 'u9-2', english: 'experiment', turkish: 'deney', example: 'We did an experiment in the lab.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-3', english: 'laboratory', turkish: 'laboratuvar', example: 'The laboratory has modern equipment.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-4', english: 'research', turkish: 'araştırma', example: 'Scientists do a lot of research.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-5', english: 'invent', turkish: 'icat etmek', example: 'Edison invented the light bulb.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-6', english: 'invention', turkish: 'icat', example: 'The telephone was a great invention.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-7', english: 'scientist', turkish: 'bilim insanı', example: 'She wants to be a scientist.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-8', english: 'technology', turkish: 'teknoloji', example: 'Technology makes life easier.', level: 'A1', unit: 9, learned: false },
  { id: 'u9-9', english: 'microscope', turkish: 'mikroskop', example: 'We used a microscope in biology class.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-10', english: 'telescope', turkish: 'teleskop', example: 'We looked at stars with a telescope.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-11', english: 'gravity', turkish: 'yerçekimi', example: 'Newton discovered gravity.', level: 'B1', unit: 9, learned: false },
  { id: 'u9-12', english: 'planet', turkish: 'gezegen', example: 'Mars is the red planet.', level: 'A1', unit: 9, learned: false },
  { id: 'u9-13', english: 'solar system', turkish: 'güneş sistemi', example: 'There are 8 planets in our solar system.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-14', english: 'energy', turkish: 'enerji', example: 'Solar energy is renewable.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-15', english: 'atom', turkish: 'atom', example: 'Everything is made of atoms.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-16', english: 'molecule', turkish: 'molekül', example: 'Water is a molecule.', level: 'B1', unit: 9, learned: false },
  { id: 'u9-17', english: 'hypothesis', turkish: 'hipotez', example: 'We need to test our hypothesis.', level: 'B1', unit: 9, learned: false },
  { id: 'u9-18', english: 'observe', turkish: 'gözlemlemek', example: 'Observe the changes carefully.', level: 'A2', unit: 9, learned: false },
  { id: 'u9-19', english: 'conclusion', turkish: 'sonuç', example: 'What is your conclusion?', level: 'A2', unit: 9, learned: false },
  { id: 'u9-20', english: 'theory', turkish: 'teori', example: 'Einstein\'s theory is famous.', level: 'B1', unit: 9, learned: false },

  // ===== UNIT 10: NATURAL FORCES =====
  { id: 'u10-1', english: 'earthquake', turkish: 'deprem', example: 'Turkey had a big earthquake.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-2', english: 'flood', turkish: 'sel', example: 'The flood destroyed many houses.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-3', english: 'tornado', turkish: 'hortum, kasırga', example: 'The tornado was very powerful.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-4', english: 'tsunami', turkish: 'tsunami', example: 'A tsunami hit the coast.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-5', english: 'volcano', turkish: 'yanardağ', example: 'The volcano erupted last year.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-6', english: 'eruption', turkish: 'patlama (yanardağ)', example: 'The eruption caused damage.', level: 'B1', unit: 10, learned: false },
  { id: 'u10-7', english: 'drought', turkish: 'kuraklık', example: 'The drought lasted for months.', level: 'B1', unit: 10, learned: false },
  { id: 'u10-8', english: 'landslide', turkish: 'heyelan', example: 'The heavy rain caused a landslide.', level: 'B1', unit: 10, learned: false },
  { id: 'u10-9', english: 'hurricane', turkish: 'kasırga', example: 'The hurricane caused a lot of damage.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-10', english: 'avalanche', turkish: 'çığ', example: 'An avalanche blocked the road.', level: 'B1', unit: 10, learned: false },
  { id: 'u10-11', english: 'disaster', turkish: 'felaket', example: 'The earthquake was a terrible disaster.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-12', english: 'damage', turkish: 'hasar', example: 'The storm caused a lot of damage.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-13', english: 'destroy', turkish: 'yıkmak, tahrip etmek', example: 'The fire destroyed the building.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-14', english: 'survivor', turkish: 'kurtulan kişi', example: 'The survivors were rescued.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-15', english: 'shelter', turkish: 'sığınak', example: 'People went to the shelter.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-16', english: 'emergency', turkish: 'acil durum', example: 'Call 112 in an emergency.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-17', english: 'warning', turkish: 'uyarı', example: 'There was a storm warning on TV.', level: 'A2', unit: 10, learned: false },
  { id: 'u10-18', english: 'evacuate', turkish: 'tahliye etmek', example: 'We had to evacuate the building.', level: 'B1', unit: 10, learned: false },
  { id: 'u10-19', english: 'collapse', turkish: 'çökmek', example: 'The building collapsed after the earthquake.', level: 'B1', unit: 10, learned: false },
  { id: 'u10-20', english: 'relief', turkish: 'yardım (afet)', example: 'Relief teams arrived quickly.', level: 'B1', unit: 10, learned: false },
];

interface VocabularyViewProps {
  onBack: () => void;
}

// Hangman figure component
const HangmanFigure = ({ wrongGuesses }: { wrongGuesses: number }) => {
  return (
    <div className="flex justify-center items-end h-64 mb-4">
      <svg width="200" height="250" className="stroke-current text-foreground">
        {/* Gallows */}
        <line x1="10" y1="230" x2="150" y2="230" strokeWidth="4" />
        <line x1="50" y1="230" x2="50" y2="20" strokeWidth="4" />
        <line x1="50" y1="20" x2="130" y2="20" strokeWidth="4" />
        <line x1="130" y1="20" x2="130" y2="50" strokeWidth="4" />

        {/* Head */}
        {wrongGuesses >= 1 && (
          <circle cx="130" cy="70" r="20" strokeWidth="4" fill="none" className="stroke-destructive animate-scale-in" />
        )}

        {/* Body */}
        {wrongGuesses >= 2 && (
          <line x1="130" y1="90" x2="130" y2="150" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}

        {/* Left Arm */}
        {wrongGuesses >= 3 && (
          <line x1="130" y1="110" x2="100" y2="130" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}

        {/* Right Arm */}
        {wrongGuesses >= 4 && (
          <line x1="130" y1="110" x2="160" y2="130" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}

        {/* Left Leg */}
        {wrongGuesses >= 5 && (
          <line x1="130" y1="150" x2="110" y2="190" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}

        {/* Right Leg */}
        {wrongGuesses >= 6 && (
          <line x1="130" y1="150" x2="150" y2="190" strokeWidth="4" className="stroke-destructive animate-scale-in" />
        )}
      </svg>
    </div>
  );
};

export function VocabularyView({ onBack }: VocabularyViewProps) {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>(INITIAL_WORDS);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [view, setView] = useState<'menu' | 'add' | 'study' | 'game' | 'hangman'>('menu');
  const [newWord, setNewWord] = useState({ english: '', turkish: '', example: '', level: 'A1' as 'A1' | 'A2' | 'B1' });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [gameCompleteScore, setGameCompleteScore] = useState(0);

  // Daily task hooks
  const { data: dailyTasks } = useDailyTasks();
  const updateTaskProgress = useUpdateTaskProgress();

  // Study mode states
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  // Game mode states
  const [gameScore, setGameScore] = useState(0);
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Hangman states
  const [hangmanWord, setHangmanWord] = useState<Word | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrongGuesses = 6;

  // Filter words by selected unit
  const filteredWords = selectedUnit ? words.filter(w => w.unit === selectedUnit) : words;

  const learnedCount = filteredWords.filter(w => w.learned).length;
  const progressPercent = (learnedCount / filteredWords.length) * 100;

  // Add new word
  const handleAddWord = () => {
    if (!newWord.english || !newWord.turkish) {
      toast.error('İngilizce kelime ve Türkçe anlam zorunlu!');
      return;
    }

    const word: Word = {
      id: Date.now().toString(),
      english: newWord.english.toLowerCase().trim(),
      turkish: newWord.turkish.trim(),
      example: newWord.example.trim(),
      level: newWord.level,
      unit: selectedUnit || 1,
      learned: false
    };

    setWords([...words, word]);
    setNewWord({ english: '', turkish: '', example: '', level: 'A1' });
    setShowAddDialog(false);
    toast.success('Kelime eklendi! 🎉');
  };

  // Study: Mark as learned/unknown
  const handleKnowWord = (know: boolean) => {
    const currentWord = filteredWords[currentWordIndex];

    if (know) {
      // Biliyorum - işaretle ve sonraki kelimeye geç
      setWords(words.map(w => w.id === currentWord.id ? { ...w, learned: true } : w));
      toast.success('Harika! ✅');
      nextWord();
    } else {
      // Bilmiyorum - anlamını göster
      setShowMeaning(true);
      toast.info('Anlamını öğren! 📖');
    }
  };

  const handleLearnWord = async () => {
    const currentWord = filteredWords[currentWordIndex];
    setWords(words.map(w => w.id === currentWord.id ? { ...w, learned: true } : w));
    toast.success('Kelime defterine eklendi! 📝');

    // Update daily task: "10 Kelime Öğren" task (task_type = 'vocabulary')
    const learnWordsTask = dailyTasks?.find(t => t.task_type === 'vocabulary');
    if (learnWordsTask && user) {
      await updateTaskProgress.mutateAsync({
        taskId: learnWordsTask.id,
        increment: 1
      });
    }

    setShowMeaning(false);
    nextWord();
  };

  const nextWord = () => {
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowMeaning(false);
    } else {
      toast.success('Tüm kelimeleri bitirdin! 🎉');
      setView('menu');
      setCurrentWordIndex(0);
    }
  };

  // Start matching game
  const startMatchingGame = () => {
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5).slice(0, 6);
    setGameWords(shuffled);
    setGameScore(0);
    setSelectedWords([]);
    setMatchedPairs([]);
    setView('game');
  };

  const handleWordClick = (word: string, type: 'english' | 'turkish') => {
    const clickedId = `${type}-${word}`;

    if (matchedPairs.includes(clickedId)) return;
    if (selectedWords.includes(clickedId)) return;

    const newSelected = [...selectedWords, clickedId];
    setSelectedWords(newSelected);

    if (newSelected.length === 2) {
      // Check match
      const [first, second] = newSelected;
      const [firstType, ...firstNameParts] = first.split('-');
      const [secondType, ...secondNameParts] = second.split('-');
      const firstName = firstNameParts.join('-');
      const secondName = secondNameParts.join('-');

      const firstWord = gameWords.find(w =>
        (firstType === 'english' && w.english === firstName) ||
        (firstType === 'turkish' && w.turkish === firstName)
      );
      const secondWord = gameWords.find(w =>
        (secondType === 'english' && w.english === secondName) ||
        (secondType === 'turkish' && w.turkish === secondName)
      );

      if (firstWord?.id === secondWord?.id && firstType !== secondType) {
        // Match!
        setMatchedPairs([...matchedPairs, first, second]);
        const newScore = gameScore + 10;
        setGameScore(newScore);
        toast.success('Eşleştirme başarılı! +10 puan 🎉');

        // Check if game completed
        if (matchedPairs.length + 2 === gameWords.length * 2) {
          setTimeout(async () => {
            // Award XP
            if (user) {
              const xpReward = newScore; // 1 puan = 1 XP
              const { data: profile } = await supabase
                .from('profiles')
                .select('total_xp')
                .eq('user_id', user.id)
                .single();

              if (profile) {
                await supabase
                  .from('profiles')
                  .update({ total_xp: (profile.total_xp || 0) + xpReward })
                  .eq('user_id', user.id);
              }

              // Update daily task
              const matchWordsTask = dailyTasks?.find(t => t.task_type === 'vocabulary');
              if (matchWordsTask) {
                await updateTaskProgress.mutateAsync({
                  taskId: matchWordsTask.id,
                  increment: 1
                });
              }

              setGameCompleteScore(newScore);
              setShowSuccessDialog(true);
            }
          }, 500);
        }
      } else {
        // No match
        toast.error('Yanlış eşleştirme!');
      }

      setTimeout(() => setSelectedWords([]), 800);
    }
  };

  // Start hangman
  const startHangman = () => {
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setHangmanWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setView('hangman');
  };

  const guessLetter = (letter: string) => {
    if (guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (!hangmanWord?.english.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);

      if (wrongGuesses + 1 >= maxWrongGuesses) {
        toast.error(`Kaybettin! Kelime: ${hangmanWord?.english} (${hangmanWord?.turkish})`);
        setTimeout(() => startHangman(), 2000);
      }
    } else {
      // Check if word is complete
      const allLetters = hangmanWord.english.split('').every(l =>
        newGuessed.includes(l) || l === ' '
      );

      if (allLetters) {
        toast.success(`Kazandın! 🎉 ${hangmanWord.english} = ${hangmanWord.turkish}`);
        setTimeout(() => startHangman(), 2000);
      }
    }
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold">İngilizce Kelime Defteri</h2>
                <p className="text-xs text-muted-foreground">{filteredWords.length} kelime · {selectedUnit ? `Ünite ${selectedUnit}` : 'Tüm üniteler'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Progress Card */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">İlerleme</span>
                <span className="text-sm font-bold text-primary">{learnedCount}/{filteredWords.length} kelime</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </CardContent>
          </Card>

          {/* Unit Filter */}
          <div className="overflow-x-auto pb-1 -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              <Button
                variant={selectedUnit === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setSelectedUnit(null); setCurrentWordIndex(0); }}
                className="shrink-0"
              >
                Tümü ({words.length})
              </Button>
              {Object.entries(UNIT_NAMES).map(([num, name]) => {
                const unitNum = Number(num);
                const unitWordCount = words.filter(w => w.unit === unitNum).length;
                const unitLearnedCount = words.filter(w => w.unit === unitNum && w.learned).length;
                return (
                  <Button
                    key={unitNum}
                    variant={selectedUnit === unitNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setSelectedUnit(unitNum); setCurrentWordIndex(0); }}
                    className="shrink-0"
                  >
                    {unitNum}. {name} ({unitLearnedCount}/{unitWordCount})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Menu Options */}
          <div className="grid gap-3">
            <Card
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => setShowAddDialog(true)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-bold">Kelime Ekle</h3>
                  <p className="text-sm text-muted-foreground">Yeni kelime ekle</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => setView('study')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Çalış</h3>
                  <p className="text-sm text-muted-foreground">Kelimeleri öğren ve tekrar et</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-warning transition-all hover:shadow-lg"
              onClick={startMatchingGame}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-bold">Kelime Oyunu</h3>
                  <p className="text-sm text-muted-foreground">İngilizce-Türkçe eşleştir</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-destructive transition-all hover:shadow-lg"
              onClick={startHangman}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold">Asmaca Oyunu</h3>
                  <p className="text-sm text-muted-foreground">Harfleri tahmin et</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Word Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kelime Ekle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">İngilizce Kelime *</label>
                <Input
                  placeholder="örn: beautiful"
                  value={newWord.english}
                  onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Türkçe Anlam *</label>
                <Input
                  placeholder="örn: güzel"
                  value={newWord.turkish}
                  onChange={(e) => setNewWord({ ...newWord, turkish: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Örnek Cümle (İngilizce)</label>
                <Textarea
                  placeholder="örn: She has a beautiful smile."
                  value={newWord.example}
                  onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Seviye</label>
                <div className="flex gap-2">
                  <Button
                    variant={newWord.level === 'A1' ? 'default' : 'outline'}
                    onClick={() => setNewWord({ ...newWord, level: 'A1' })}
                    className="flex-1"
                  >
                    A1
                  </Button>
                  <Button
                    variant={newWord.level === 'A2' ? 'default' : 'outline'}
                    onClick={() => setNewWord({ ...newWord, level: 'A2' })}
                    className="flex-1"
                  >
                    A2
                  </Button>
                  <Button
                    variant={newWord.level === 'B1' ? 'default' : 'outline'}
                    onClick={() => setNewWord({ ...newWord, level: 'B1' })}
                    className="flex-1"
                  >
                    B1
                  </Button>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleAddWord}
                disabled={!newWord.english || !newWord.turkish}
              >
                Kelimeyi Ekle
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog for Game Completion */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">🎉 Başardın!</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4 py-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-warning to-primary rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">{gameCompleteScore} Puan</p>
                <p className="text-lg font-semibold text-success">+{gameCompleteScore} XP Kazandın!</p>
              </div>
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <p className="text-sm text-muted-foreground">
                  Tüm kelimeleri başarıyla eşleştirdin! 🌟
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccessDialog(false);
                    setView('menu');
                  }}
                  className="flex-1"
                >
                  Ana Menü
                </Button>
                <Button
                  onClick={() => {
                    setShowSuccessDialog(false);
                    startMatchingGame();
                  }}
                  className="flex-1"
                >
                  Tekrar Oyna
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (view === 'study') {
    const currentWord = filteredWords[currentWordIndex];

    if (!currentWord) {
      setView('menu');
      setCurrentWordIndex(0);
      return null;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView('menu')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-bold">Kelime Çalışması{selectedUnit ? ` - ${UNIT_NAMES[selectedUnit]}` : ''}</h2>
              <Progress value={(currentWordIndex / filteredWords.length) * 100} className="h-2 mt-1" />
            </div>
            <span className="text-sm font-medium">{currentWordIndex + 1}/{filteredWords.length}</span>
          </div>
        </div>

        <div className="max-w-xl mx-auto p-4 flex items-center justify-center min-h-[80vh]">
          <Card className="w-full">
            <CardContent className="p-8 text-center space-y-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speakWord(currentWord.english)}
                className="absolute top-4 right-4"
              >
                <Volume2 className="w-5 h-5" />
              </Button>

              <Badge variant="outline" className="mb-2">{currentWord.level}</Badge>

              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-primary mb-2">{currentWord.english}</h1>
                  {showMeaning && (
                    <p className="text-2xl font-semibold text-accent animate-slide-up">{currentWord.turkish}</p>
                  )}
                </div>

                {showMeaning ? (
                  <div className="animate-slide-up space-y-4">
                    {currentWord.example && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm italic text-muted-foreground">"{currentWord.example}"</p>
                      </div>
                    )}
                    <Button onClick={handleLearnWord} size="lg" className="w-full">
                      Öğrendim, Defterime Ekle 📝
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground">Bu kelimenin anlamını biliyor musun?</p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleKnowWord(true)}
                        className="flex-1 bg-success hover:bg-success/90"
                        size="lg"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Biliyorum
                      </Button>
                      <Button
                        onClick={() => handleKnowWord(false)}
                        variant="outline"
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                        size="lg"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Bilmiyorum
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'game') {
    const allGameItems = [
      ...gameWords.map(w => ({ id: `english-${w.english}`, text: w.english, type: 'english' as const, level: w.level })),
      ...gameWords.map(w => ({ id: `turkish-${w.turkish}`, text: w.turkish, type: 'turkish' as const, level: w.level }))
    ].sort(() => Math.random() - 0.5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-warning/5 to-background">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView('menu')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-bold">Kelime Eşleştirme Oyunu</h2>
              <p className="text-xs text-muted-foreground">İngilizce ve Türkçe kelimeleri eşleştir</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Puan</p>
              <p className="text-2xl font-bold text-warning">{gameScore}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {allGameItems.map(item => (
              <Card
                key={item.id}
                className={cn(
                  "cursor-pointer transition-all",
                  matchedPairs.includes(item.id) && "opacity-30 cursor-not-allowed bg-success/20 border-success",
                  selectedWords.includes(item.id) && !matchedPairs.includes(item.id) && "border-primary bg-primary/10 scale-95",
                  !matchedPairs.includes(item.id) && !selectedWords.includes(item.id) && "hover:border-warning hover:scale-105"
                )}
                onClick={() => !matchedPairs.includes(item.id) && handleWordClick(item.text, item.type)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <p className={cn(
                      "font-bold",
                      item.type === 'english' ? "text-primary" : "text-accent"
                    )}>
                      {item.text}
                    </p>
                    <Badge variant="outline" className="text-xs">{item.level}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.type === 'english' ? '🇬🇧 İngilizce' : '🇹🇷 Türkçe'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'hangman' && hangmanWord) {
    const displayWord = hangmanWord.english.split('').map(letter =>
      guessedLetters.includes(letter) || letter === ' ' ? letter : '_'
    ).join(' ');

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const isGameOver = wrongGuesses >= maxWrongGuesses;
    const isWon = hangmanWord.english.split('').every(l => guessedLetters.includes(l) || l === ' ');

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-background">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView('menu')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-bold">Asmaca Oyunu</h2>
              <p className="text-xs text-muted-foreground">Harfleri tahmin et</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Hata</p>
              <p className="text-2xl font-bold text-destructive">{wrongGuesses}/{maxWrongGuesses}</p>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto p-4 space-y-4">
          {/* Hint at top */}
          <Card className="bg-info/5 border-info/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Info className="w-5 h-5 text-info" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">İpucu:</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg">{hangmanWord.turkish}</p>
                  <Badge variant="outline">{hangmanWord.level}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hangman Visual with Skeleton */}
          <Card>
            <CardContent className="p-8 text-center">
              <HangmanFigure wrongGuesses={wrongGuesses} />

              <div className="text-4xl font-mono font-bold tracking-widest mb-4">
                {displayWord}
              </div>

              {isGameOver && (
                <div className="p-4 bg-destructive/10 rounded-lg animate-slide-up">
                  <p className="font-bold text-destructive mb-1">Kaybettin! 😵</p>
                  <p className="text-2xl font-bold">{hangmanWord.english}</p>
                  <p className="text-lg text-muted-foreground">({hangmanWord.turkish})</p>
                </div>
              )}
              {isWon && (
                <div className="p-4 bg-success/10 rounded-lg animate-slide-up">
                  <p className="text-2xl font-bold text-success">🎉 Tebrikler!</p>
                  <p className="text-lg">{hangmanWord.english} = {hangmanWord.turkish}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alphabet */}
          <div className="grid grid-cols-7 gap-2">
            {alphabet.map(letter => (
              <Button
                key={letter}
                onClick={() => guessLetter(letter)}
                disabled={guessedLetters.includes(letter) || isGameOver || isWon}
                className={cn(
                  "h-12 text-lg font-bold",
                  guessedLetters.includes(letter) && hangmanWord.english.includes(letter) && "bg-success",
                  guessedLetters.includes(letter) && !hangmanWord.english.includes(letter) && "bg-destructive"
                )}
                variant={guessedLetters.includes(letter) ? "default" : "outline"}
              >
                {letter.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
