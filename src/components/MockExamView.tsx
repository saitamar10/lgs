import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mascot } from '@/components/Mascot';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Play, 
  CheckCircle2, 
  XCircle, 
  MinusCircle,
  AlertTriangle,
  Trophy,
  Target,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface MockExamViewProps {
  onBack: () => void;
}

interface ExamQuestion {
  id: number;
  subject: string;
  questionNumber: number;
  correctAnswer: string;
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  pdfUrls: {
    verbal: string; // Sözel bölüm PDF
    numeric: string; // Sayısal bölüm PDF
  };
  questions: ExamQuestion[];
  subjects: {
    name: string;
    questionCount: number;
    startIndex: number;
    pdfType: 'verbal' | 'numeric';
  }[];
}

type ExamPhase = 'list' | 'exam' | 'result';
type AnswerState = 'A' | 'B' | 'C' | 'D' | 'empty';

// Mock exams data
const mockExams: ExamData[] = [
{
  id: 'online-1',
  title: 'Online Deneme Sınavı 1',
  description: 'MEB formatında 90 soruluk tam deneme sınavı',
  duration: 135, // 2 saat 15 dakika
  pdfUrls: {
    verbal: 'https://bartinodm.meb.gov.tr/meb_iys_dosyalar/2020_06/18110220_ONLINE_1_SOZ_A.pdf',
    numeric: 'https://bartinodm.meb.gov.tr/meb_iys_dosyalar/2020_06/18110220_ONLINE_1_SAY_A.pdf'
  },
  subjects: [
    { name: 'Türkçe', questionCount: 20, startIndex: 0, pdfType: 'verbal' },
    { name: 'T.C. İnkılap Tarihi', questionCount: 10, startIndex: 20, pdfType: 'verbal' },
    { name: 'Din Kültürü', questionCount: 10, startIndex: 30, pdfType: 'verbal' },
    { name: 'İngilizce', questionCount: 10, startIndex: 40, pdfType: 'verbal' },
    { name: 'Matematik', questionCount: 20, startIndex: 50, pdfType: 'numeric' },
    { name: 'Fen Bilimleri', questionCount: 20, startIndex: 70, pdfType: 'numeric' },
  ],
  questions: [
    // Türkçe (1-20)
    { id: 1, subject: 'Türkçe', questionNumber: 1, correctAnswer: 'D' },
    { id: 2, subject: 'Türkçe', questionNumber: 2, correctAnswer: 'C' },
    { id: 3, subject: 'Türkçe', questionNumber: 3, correctAnswer: 'D' },
    { id: 4, subject: 'Türkçe', questionNumber: 4, correctAnswer: 'B' },
    { id: 5, subject: 'Türkçe', questionNumber: 5, correctAnswer: 'A' },
    { id: 6, subject: 'Türkçe', questionNumber: 6, correctAnswer: 'C' },
    { id: 7, subject: 'Türkçe', questionNumber: 7, correctAnswer: 'B' },
    { id: 8, subject: 'Türkçe', questionNumber: 8, correctAnswer: 'B' },
    { id: 9, subject: 'Türkçe', questionNumber: 9, correctAnswer: 'C' },
    { id: 10, subject: 'Türkçe', questionNumber: 10, correctAnswer: 'C' },
    { id: 11, subject: 'Türkçe', questionNumber: 11, correctAnswer: 'D' },
    { id: 12, subject: 'Türkçe', questionNumber: 12, correctAnswer: 'B' },
    { id: 13, subject: 'Türkçe', questionNumber: 13, correctAnswer: 'A' },
    { id: 14, subject: 'Türkçe', questionNumber: 14, correctAnswer: 'B' },
    { id: 15, subject: 'Türkçe', questionNumber: 15, correctAnswer: 'B' },
    { id: 16, subject: 'Türkçe', questionNumber: 16, correctAnswer: 'A' },
    { id: 17, subject: 'Türkçe', questionNumber: 17, correctAnswer: 'A' },
    { id: 18, subject: 'Türkçe', questionNumber: 18, correctAnswer: 'C' },
    { id: 19, subject: 'Türkçe', questionNumber: 19, correctAnswer: 'D' },
    { id: 20, subject: 'Türkçe', questionNumber: 20, correctAnswer: 'D' },
    // T.C. İnkılap Tarihi (1-10)
    { id: 21, subject: 'T.C. İnkılap Tarihi', questionNumber: 1, correctAnswer: 'B' },
    { id: 22, subject: 'T.C. İnkılap Tarihi', questionNumber: 2, correctAnswer: 'A' },
    { id: 23, subject: 'T.C. İnkılap Tarihi', questionNumber: 3, correctAnswer: 'D' },
    { id: 24, subject: 'T.C. İnkılap Tarihi', questionNumber: 4, correctAnswer: 'A' },
    { id: 25, subject: 'T.C. İnkılap Tarihi', questionNumber: 5, correctAnswer: 'C' },
    { id: 26, subject: 'T.C. İnkılap Tarihi', questionNumber: 6, correctAnswer: 'B' },
    { id: 27, subject: 'T.C. İnkılap Tarihi', questionNumber: 7, correctAnswer: 'D' },
    { id: 28, subject: 'T.C. İnkılap Tarihi', questionNumber: 8, correctAnswer: 'B' },
    { id: 29, subject: 'T.C. İnkılap Tarihi', questionNumber: 9, correctAnswer: 'D' },
    { id: 30, subject: 'T.C. İnkılap Tarihi', questionNumber: 10, correctAnswer: 'C' },
    // Din Kültürü (1-10)
    { id: 31, subject: 'Din Kültürü', questionNumber: 1, correctAnswer: 'A' },
    { id: 32, subject: 'Din Kültürü', questionNumber: 2, correctAnswer: 'A' },
    { id: 33, subject: 'Din Kültürü', questionNumber: 3, correctAnswer: 'D' },
    { id: 34, subject: 'Din Kültürü', questionNumber: 4, correctAnswer: 'C' },
    { id: 35, subject: 'Din Kültürü', questionNumber: 5, correctAnswer: 'A' },
    { id: 36, subject: 'Din Kültürü', questionNumber: 6, correctAnswer: 'D' },
    { id: 37, subject: 'Din Kültürü', questionNumber: 7, correctAnswer: 'B' },
    { id: 38, subject: 'Din Kültürü', questionNumber: 8, correctAnswer: 'B' },
    { id: 39, subject: 'Din Kültürü', questionNumber: 9, correctAnswer: 'A' },
    { id: 40, subject: 'Din Kültürü', questionNumber: 10, correctAnswer: 'C' },
    // İngilizce (1-10)
    { id: 41, subject: 'İngilizce', questionNumber: 1, correctAnswer: 'D' },
    { id: 42, subject: 'İngilizce', questionNumber: 2, correctAnswer: 'B' },
    { id: 43, subject: 'İngilizce', questionNumber: 3, correctAnswer: 'C' },
    { id: 44, subject: 'İngilizce', questionNumber: 4, correctAnswer: 'A' },
    { id: 45, subject: 'İngilizce', questionNumber: 5, correctAnswer: 'D' },
    { id: 46, subject: 'İngilizce', questionNumber: 6, correctAnswer: 'D' },
    { id: 47, subject: 'İngilizce', questionNumber: 7, correctAnswer: 'C' },
    { id: 48, subject: 'İngilizce', questionNumber: 8, correctAnswer: 'C' },
    { id: 49, subject: 'İngilizce', questionNumber: 9, correctAnswer: 'D' },
    { id: 50, subject: 'İngilizce', questionNumber: 10, correctAnswer: 'B' },
    // Matematik (1-20)
    { id: 51, subject: 'Matematik', questionNumber: 1, correctAnswer: 'A' },
    { id: 52, subject: 'Matematik', questionNumber: 2, correctAnswer: 'D' },
    { id: 53, subject: 'Matematik', questionNumber: 3, correctAnswer: 'B' },
    { id: 54, subject: 'Matematik', questionNumber: 4, correctAnswer: 'C' },
    { id: 55, subject: 'Matematik', questionNumber: 5, correctAnswer: 'B' },
    { id: 56, subject: 'Matematik', questionNumber: 6, correctAnswer: 'B' },
    { id: 57, subject: 'Matematik', questionNumber: 7, correctAnswer: 'A' },
    { id: 58, subject: 'Matematik', questionNumber: 8, correctAnswer: 'A' },
    { id: 59, subject: 'Matematik', questionNumber: 9, correctAnswer: 'B' },
    { id: 60, subject: 'Matematik', questionNumber: 10, correctAnswer: 'C' },
    { id: 61, subject: 'Matematik', questionNumber: 11, correctAnswer: 'D' },
    { id: 62, subject: 'Matematik', questionNumber: 12, correctAnswer: 'D' },
    { id: 63, subject: 'Matematik', questionNumber: 13, correctAnswer: 'C' },
    { id: 64, subject: 'Matematik', questionNumber: 14, correctAnswer: 'D' },
    { id: 65, subject: 'Matematik', questionNumber: 15, correctAnswer: 'C' },
    { id: 66, subject: 'Matematik', questionNumber: 16, correctAnswer: 'C' },
    { id: 67, subject: 'Matematik', questionNumber: 17, correctAnswer: 'B' },
    { id: 68, subject: 'Matematik', questionNumber: 18, correctAnswer: 'D' },
    { id: 69, subject: 'Matematik', questionNumber: 19, correctAnswer: 'A' },
    { id: 70, subject: 'Matematik', questionNumber: 20, correctAnswer: 'A' },
    // Fen Bilimleri (1-20)
    { id: 71, subject: 'Fen Bilimleri', questionNumber: 1, correctAnswer: 'C' },
    { id: 72, subject: 'Fen Bilimleri', questionNumber: 2, correctAnswer: 'C' },
    { id: 73, subject: 'Fen Bilimleri', questionNumber: 3, correctAnswer: 'D' },
    { id: 74, subject: 'Fen Bilimleri', questionNumber: 4, correctAnswer: 'B' },
    { id: 75, subject: 'Fen Bilimleri', questionNumber: 5, correctAnswer: 'A' },
    { id: 76, subject: 'Fen Bilimleri', questionNumber: 6, correctAnswer: 'D' },
    { id: 77, subject: 'Fen Bilimleri', questionNumber: 7, correctAnswer: 'C' },
    { id: 78, subject: 'Fen Bilimleri', questionNumber: 8, correctAnswer: 'A' },
    { id: 79, subject: 'Fen Bilimleri', questionNumber: 9, correctAnswer: 'D' },
    { id: 80, subject: 'Fen Bilimleri', questionNumber: 10, correctAnswer: 'C' },
    { id: 81, subject: 'Fen Bilimleri', questionNumber: 11, correctAnswer: 'B' },
    { id: 82, subject: 'Fen Bilimleri', questionNumber: 12, correctAnswer: 'A' },
    { id: 83, subject: 'Fen Bilimleri', questionNumber: 13, correctAnswer: 'B' },
    { id: 84, subject: 'Fen Bilimleri', questionNumber: 14, correctAnswer: 'D' },
    { id: 85, subject: 'Fen Bilimleri', questionNumber: 15, correctAnswer: 'A' },
    { id: 86, subject: 'Fen Bilimleri', questionNumber: 16, correctAnswer: 'B' },
    { id: 87, subject: 'Fen Bilimleri', questionNumber: 17, correctAnswer: 'D' },
    { id: 88, subject: 'Fen Bilimleri', questionNumber: 18, correctAnswer: 'D' },
    { id: 89, subject: 'Fen Bilimleri', questionNumber: 19, correctAnswer: 'C' },
    { id: 90, subject: 'Fen Bilimleri', questionNumber: 20, correctAnswer: 'B' },
  ]
},
{
  id: 'cikmis-sorular',
  title: 'Çıkmış Sorular Denemesi',
  description: 'Geçmiş yıl LGS sorularından oluşturulmuş özel deneme',
  duration: 135,
  pdfUrls: {
    verbal: 'https://bartinodm.meb.gov.tr/meb_iys_dosyalar/2020_06/18110220_ONLINE_1_SOZ_A.pdf',
    numeric: 'https://bartinodm.meb.gov.tr/meb_iys_dosyalar/2020_06/18110220_ONLINE_1_SAY_A.pdf'
  },
  subjects: [
    { name: 'Türkçe', questionCount: 20, startIndex: 0, pdfType: 'verbal' },
    { name: 'T.C. İnkılap Tarihi', questionCount: 10, startIndex: 20, pdfType: 'verbal' },
    { name: 'Din Kültürü', questionCount: 10, startIndex: 30, pdfType: 'verbal' },
    { name: 'İngilizce', questionCount: 10, startIndex: 40, pdfType: 'verbal' },
    { name: 'Matematik', questionCount: 20, startIndex: 50, pdfType: 'numeric' },
    { name: 'Fen Bilimleri', questionCount: 20, startIndex: 70, pdfType: 'numeric' },
  ],
  questions: [
    // Türkçe (1-20)
    { id: 1, subject: 'Türkçe', questionNumber: 1, correctAnswer: 'C' },
    { id: 2, subject: 'Türkçe', questionNumber: 2, correctAnswer: 'A' },
    { id: 3, subject: 'Türkçe', questionNumber: 3, correctAnswer: 'B' },
    { id: 4, subject: 'Türkçe', questionNumber: 4, correctAnswer: 'D' },
    { id: 5, subject: 'Türkçe', questionNumber: 5, correctAnswer: 'C' },
    { id: 6, subject: 'Türkçe', questionNumber: 6, correctAnswer: 'A' },
    { id: 7, subject: 'Türkçe', questionNumber: 7, correctAnswer: 'D' },
    { id: 8, subject: 'Türkçe', questionNumber: 8, correctAnswer: 'B' },
    { id: 9, subject: 'Türkçe', questionNumber: 9, correctAnswer: 'A' },
    { id: 10, subject: 'Türkçe', questionNumber: 10, correctAnswer: 'C' },
    { id: 11, subject: 'Türkçe', questionNumber: 11, correctAnswer: 'B' },
    { id: 12, subject: 'Türkçe', questionNumber: 12, correctAnswer: 'D' },
    { id: 13, subject: 'Türkçe', questionNumber: 13, correctAnswer: 'C' },
    { id: 14, subject: 'Türkçe', questionNumber: 14, correctAnswer: 'A' },
    { id: 15, subject: 'Türkçe', questionNumber: 15, correctAnswer: 'B' },
    { id: 16, subject: 'Türkçe', questionNumber: 16, correctAnswer: 'D' },
    { id: 17, subject: 'Türkçe', questionNumber: 17, correctAnswer: 'C' },
    { id: 18, subject: 'Türkçe', questionNumber: 18, correctAnswer: 'A' },
    { id: 19, subject: 'Türkçe', questionNumber: 19, correctAnswer: 'B' },
    { id: 20, subject: 'Türkçe', questionNumber: 20, correctAnswer: 'D' },
    // T.C. İnkılap Tarihi (1-10)
    { id: 21, subject: 'T.C. İnkılap Tarihi', questionNumber: 1, correctAnswer: 'A' },
    { id: 22, subject: 'T.C. İnkılap Tarihi', questionNumber: 2, correctAnswer: 'C' },
    { id: 23, subject: 'T.C. İnkılap Tarihi', questionNumber: 3, correctAnswer: 'B' },
    { id: 24, subject: 'T.C. İnkılap Tarihi', questionNumber: 4, correctAnswer: 'D' },
    { id: 25, subject: 'T.C. İnkılap Tarihi', questionNumber: 5, correctAnswer: 'A' },
    { id: 26, subject: 'T.C. İnkılap Tarihi', questionNumber: 6, correctAnswer: 'C' },
    { id: 27, subject: 'T.C. İnkılap Tarihi', questionNumber: 7, correctAnswer: 'B' },
    { id: 28, subject: 'T.C. İnkılap Tarihi', questionNumber: 8, correctAnswer: 'D' },
    { id: 29, subject: 'T.C. İnkılap Tarihi', questionNumber: 9, correctAnswer: 'A' },
    { id: 30, subject: 'T.C. İnkılap Tarihi', questionNumber: 10, correctAnswer: 'C' },
    // Din Kültürü (1-10)
    { id: 31, subject: 'Din Kültürü', questionNumber: 1, correctAnswer: 'B' },
    { id: 32, subject: 'Din Kültürü', questionNumber: 2, correctAnswer: 'D' },
    { id: 33, subject: 'Din Kültürü', questionNumber: 3, correctAnswer: 'A' },
    { id: 34, subject: 'Din Kültürü', questionNumber: 4, correctAnswer: 'C' },
    { id: 35, subject: 'Din Kültürü', questionNumber: 5, correctAnswer: 'B' },
    { id: 36, subject: 'Din Kültürü', questionNumber: 6, correctAnswer: 'D' },
    { id: 37, subject: 'Din Kültürü', questionNumber: 7, correctAnswer: 'A' },
    { id: 38, subject: 'Din Kültürü', questionNumber: 8, correctAnswer: 'C' },
    { id: 39, subject: 'Din Kültürü', questionNumber: 9, correctAnswer: 'B' },
    { id: 40, subject: 'Din Kültürü', questionNumber: 10, correctAnswer: 'D' },
    // İngilizce (1-10)
    { id: 41, subject: 'İngilizce', questionNumber: 1, correctAnswer: 'C' },
    { id: 42, subject: 'İngilizce', questionNumber: 2, correctAnswer: 'A' },
    { id: 43, subject: 'İngilizce', questionNumber: 3, correctAnswer: 'B' },
    { id: 44, subject: 'İngilizce', questionNumber: 4, correctAnswer: 'D' },
    { id: 45, subject: 'İngilizce', questionNumber: 5, correctAnswer: 'C' },
    { id: 46, subject: 'İngilizce', questionNumber: 6, correctAnswer: 'A' },
    { id: 47, subject: 'İngilizce', questionNumber: 7, correctAnswer: 'B' },
    { id: 48, subject: 'İngilizce', questionNumber: 8, correctAnswer: 'D' },
    { id: 49, subject: 'İngilizce', questionNumber: 9, correctAnswer: 'C' },
    { id: 50, subject: 'İngilizce', questionNumber: 10, correctAnswer: 'A' },
    // Matematik (1-20)
    { id: 51, subject: 'Matematik', questionNumber: 1, correctAnswer: 'B' },
    { id: 52, subject: 'Matematik', questionNumber: 2, correctAnswer: 'D' },
    { id: 53, subject: 'Matematik', questionNumber: 3, correctAnswer: 'A' },
    { id: 54, subject: 'Matematik', questionNumber: 4, correctAnswer: 'C' },
    { id: 55, subject: 'Matematik', questionNumber: 5, correctAnswer: 'B' },
    { id: 56, subject: 'Matematik', questionNumber: 6, correctAnswer: 'D' },
    { id: 57, subject: 'Matematik', questionNumber: 7, correctAnswer: 'A' },
    { id: 58, subject: 'Matematik', questionNumber: 8, correctAnswer: 'C' },
    { id: 59, subject: 'Matematik', questionNumber: 9, correctAnswer: 'B' },
    { id: 60, subject: 'Matematik', questionNumber: 10, correctAnswer: 'D' },
    { id: 61, subject: 'Matematik', questionNumber: 11, correctAnswer: 'A' },
    { id: 62, subject: 'Matematik', questionNumber: 12, correctAnswer: 'C' },
    { id: 63, subject: 'Matematik', questionNumber: 13, correctAnswer: 'B' },
    { id: 64, subject: 'Matematik', questionNumber: 14, correctAnswer: 'D' },
    { id: 65, subject: 'Matematik', questionNumber: 15, correctAnswer: 'A' },
    { id: 66, subject: 'Matematik', questionNumber: 16, correctAnswer: 'C' },
    { id: 67, subject: 'Matematik', questionNumber: 17, correctAnswer: 'B' },
    { id: 68, subject: 'Matematik', questionNumber: 18, correctAnswer: 'D' },
    { id: 69, subject: 'Matematik', questionNumber: 19, correctAnswer: 'A' },
    { id: 70, subject: 'Matematik', questionNumber: 20, correctAnswer: 'C' },
    // Fen Bilimleri (1-20)
    { id: 71, subject: 'Fen Bilimleri', questionNumber: 1, correctAnswer: 'B' },
    { id: 72, subject: 'Fen Bilimleri', questionNumber: 2, correctAnswer: 'D' },
    { id: 73, subject: 'Fen Bilimleri', questionNumber: 3, correctAnswer: 'A' },
    { id: 74, subject: 'Fen Bilimleri', questionNumber: 4, correctAnswer: 'C' },
    { id: 75, subject: 'Fen Bilimleri', questionNumber: 5, correctAnswer: 'B' },
    { id: 76, subject: 'Fen Bilimleri', questionNumber: 6, correctAnswer: 'D' },
    { id: 77, subject: 'Fen Bilimleri', questionNumber: 7, correctAnswer: 'A' },
    { id: 78, subject: 'Fen Bilimleri', questionNumber: 8, correctAnswer: 'C' },
    { id: 79, subject: 'Fen Bilimleri', questionNumber: 9, correctAnswer: 'B' },
    { id: 80, subject: 'Fen Bilimleri', questionNumber: 10, correctAnswer: 'D' },
    { id: 81, subject: 'Fen Bilimleri', questionNumber: 11, correctAnswer: 'A' },
    { id: 82, subject: 'Fen Bilimleri', questionNumber: 12, correctAnswer: 'C' },
    { id: 83, subject: 'Fen Bilimleri', questionNumber: 13, correctAnswer: 'B' },
    { id: 84, subject: 'Fen Bilimleri', questionNumber: 14, correctAnswer: 'D' },
    { id: 85, subject: 'Fen Bilimleri', questionNumber: 15, correctAnswer: 'A' },
    { id: 86, subject: 'Fen Bilimleri', questionNumber: 16, correctAnswer: 'C' },
    { id: 87, subject: 'Fen Bilimleri', questionNumber: 17, correctAnswer: 'B' },
    { id: 88, subject: 'Fen Bilimleri', questionNumber: 18, correctAnswer: 'D' },
    { id: 89, subject: 'Fen Bilimleri', questionNumber: 19, correctAnswer: 'A' },
    { id: 90, subject: 'Fen Bilimleri', questionNumber: 20, correctAnswer: 'C' },
  ]
},
{
  id: 'meb-lgs-2',
  title: 'MEB LGS Denemesi 2',
  description: 'MEB formatında 90 soruluk tam deneme sınavı',
  duration: 135,
  pdfUrls: {
    verbal: 'https://bartinodm.meb.gov.tr/meb_iys_dosyalar/2020_06/18110220_ONLINE_1_SOZ_A.pdf',
    numeric: 'https://bartinodm.meb.gov.tr/meb_iys_dosyalar/2020_06/18110220_ONLINE_1_SAY_A.pdf'
  },
  subjects: [
    { name: 'Türkçe', questionCount: 20, startIndex: 0, pdfType: 'verbal' },
    { name: 'T.C. İnkılap Tarihi', questionCount: 10, startIndex: 20, pdfType: 'verbal' },
    { name: 'Din Kültürü', questionCount: 10, startIndex: 30, pdfType: 'verbal' },
    { name: 'İngilizce', questionCount: 10, startIndex: 40, pdfType: 'verbal' },
    { name: 'Matematik', questionCount: 20, startIndex: 50, pdfType: 'numeric' },
    { name: 'Fen Bilimleri', questionCount: 20, startIndex: 70, pdfType: 'numeric' },
  ],
  questions: [
    // Türkçe (1-20)
    { id: 1, subject: 'Türkçe', questionNumber: 1, correctAnswer: 'A' },
    { id: 2, subject: 'Türkçe', questionNumber: 2, correctAnswer: 'B' },
    { id: 3, subject: 'Türkçe', questionNumber: 3, correctAnswer: 'C' },
    { id: 4, subject: 'Türkçe', questionNumber: 4, correctAnswer: 'D' },
    { id: 5, subject: 'Türkçe', questionNumber: 5, correctAnswer: 'A' },
    { id: 6, subject: 'Türkçe', questionNumber: 6, correctAnswer: 'B' },
    { id: 7, subject: 'Türkçe', questionNumber: 7, correctAnswer: 'C' },
    { id: 8, subject: 'Türkçe', questionNumber: 8, correctAnswer: 'D' },
    { id: 9, subject: 'Türkçe', questionNumber: 9, correctAnswer: 'A' },
    { id: 10, subject: 'Türkçe', questionNumber: 10, correctAnswer: 'B' },
    { id: 11, subject: 'Türkçe', questionNumber: 11, correctAnswer: 'C' },
    { id: 12, subject: 'Türkçe', questionNumber: 12, correctAnswer: 'D' },
    { id: 13, subject: 'Türkçe', questionNumber: 13, correctAnswer: 'A' },
    { id: 14, subject: 'Türkçe', questionNumber: 14, correctAnswer: 'B' },
    { id: 15, subject: 'Türkçe', questionNumber: 15, correctAnswer: 'C' },
    { id: 16, subject: 'Türkçe', questionNumber: 16, correctAnswer: 'D' },
    { id: 17, subject: 'Türkçe', questionNumber: 17, correctAnswer: 'A' },
    { id: 18, subject: 'Türkçe', questionNumber: 18, correctAnswer: 'B' },
    { id: 19, subject: 'Türkçe', questionNumber: 19, correctAnswer: 'C' },
    { id: 20, subject: 'Türkçe', questionNumber: 20, correctAnswer: 'D' },
    // T.C. İnkılap Tarihi (1-10)
    { id: 21, subject: 'T.C. İnkılap Tarihi', questionNumber: 1, correctAnswer: 'C' },
    { id: 22, subject: 'T.C. İnkılap Tarihi', questionNumber: 2, correctAnswer: 'D' },
    { id: 23, subject: 'T.C. İnkılap Tarihi', questionNumber: 3, correctAnswer: 'A' },
    { id: 24, subject: 'T.C. İnkılap Tarihi', questionNumber: 4, correctAnswer: 'B' },
    { id: 25, subject: 'T.C. İnkılap Tarihi', questionNumber: 5, correctAnswer: 'C' },
    { id: 26, subject: 'T.C. İnkılap Tarihi', questionNumber: 6, correctAnswer: 'D' },
    { id: 27, subject: 'T.C. İnkılap Tarihi', questionNumber: 7, correctAnswer: 'A' },
    { id: 28, subject: 'T.C. İnkılap Tarihi', questionNumber: 8, correctAnswer: 'B' },
    { id: 29, subject: 'T.C. İnkılap Tarihi', questionNumber: 9, correctAnswer: 'C' },
    { id: 30, subject: 'T.C. İnkılap Tarihi', questionNumber: 10, correctAnswer: 'D' },
    // Din Kültürü (1-10)
    { id: 31, subject: 'Din Kültürü', questionNumber: 1, correctAnswer: 'D' },
    { id: 32, subject: 'Din Kültürü', questionNumber: 2, correctAnswer: 'A' },
    { id: 33, subject: 'Din Kültürü', questionNumber: 3, correctAnswer: 'B' },
    { id: 34, subject: 'Din Kültürü', questionNumber: 4, correctAnswer: 'C' },
    { id: 35, subject: 'Din Kültürü', questionNumber: 5, correctAnswer: 'D' },
    { id: 36, subject: 'Din Kültürü', questionNumber: 6, correctAnswer: 'A' },
    { id: 37, subject: 'Din Kültürü', questionNumber: 7, correctAnswer: 'B' },
    { id: 38, subject: 'Din Kültürü', questionNumber: 8, correctAnswer: 'C' },
    { id: 39, subject: 'Din Kültürü', questionNumber: 9, correctAnswer: 'D' },
    { id: 40, subject: 'Din Kültürü', questionNumber: 10, correctAnswer: 'A' },
    // İngilizce (1-10)
    { id: 41, subject: 'İngilizce', questionNumber: 1, correctAnswer: 'B' },
    { id: 42, subject: 'İngilizce', questionNumber: 2, correctAnswer: 'C' },
    { id: 43, subject: 'İngilizce', questionNumber: 3, correctAnswer: 'D' },
    { id: 44, subject: 'İngilizce', questionNumber: 4, correctAnswer: 'A' },
    { id: 45, subject: 'İngilizce', questionNumber: 5, correctAnswer: 'B' },
    { id: 46, subject: 'İngilizce', questionNumber: 6, correctAnswer: 'C' },
    { id: 47, subject: 'İngilizce', questionNumber: 7, correctAnswer: 'D' },
    { id: 48, subject: 'İngilizce', questionNumber: 8, correctAnswer: 'A' },
    { id: 49, subject: 'İngilizce', questionNumber: 9, correctAnswer: 'B' },
    { id: 50, subject: 'İngilizce', questionNumber: 10, correctAnswer: 'C' },
    // Matematik (1-20)
    { id: 51, subject: 'Matematik', questionNumber: 1, correctAnswer: 'D' },
    { id: 52, subject: 'Matematik', questionNumber: 2, correctAnswer: 'A' },
    { id: 53, subject: 'Matematik', questionNumber: 3, correctAnswer: 'B' },
    { id: 54, subject: 'Matematik', questionNumber: 4, correctAnswer: 'C' },
    { id: 55, subject: 'Matematik', questionNumber: 5, correctAnswer: 'D' },
    { id: 56, subject: 'Matematik', questionNumber: 6, correctAnswer: 'A' },
    { id: 57, subject: 'Matematik', questionNumber: 7, correctAnswer: 'B' },
    { id: 58, subject: 'Matematik', questionNumber: 8, correctAnswer: 'C' },
    { id: 59, subject: 'Matematik', questionNumber: 9, correctAnswer: 'D' },
    { id: 60, subject: 'Matematik', questionNumber: 10, correctAnswer: 'A' },
    { id: 61, subject: 'Matematik', questionNumber: 11, correctAnswer: 'B' },
    { id: 62, subject: 'Matematik', questionNumber: 12, correctAnswer: 'C' },
    { id: 63, subject: 'Matematik', questionNumber: 13, correctAnswer: 'D' },
    { id: 64, subject: 'Matematik', questionNumber: 14, correctAnswer: 'A' },
    { id: 65, subject: 'Matematik', questionNumber: 15, correctAnswer: 'B' },
    { id: 66, subject: 'Matematik', questionNumber: 16, correctAnswer: 'C' },
    { id: 67, subject: 'Matematik', questionNumber: 17, correctAnswer: 'D' },
    { id: 68, subject: 'Matematik', questionNumber: 18, correctAnswer: 'A' },
    { id: 69, subject: 'Matematik', questionNumber: 19, correctAnswer: 'B' },
    { id: 70, subject: 'Matematik', questionNumber: 20, correctAnswer: 'C' },
    // Fen Bilimleri (1-20)
    { id: 71, subject: 'Fen Bilimleri', questionNumber: 1, correctAnswer: 'D' },
    { id: 72, subject: 'Fen Bilimleri', questionNumber: 2, correctAnswer: 'A' },
    { id: 73, subject: 'Fen Bilimleri', questionNumber: 3, correctAnswer: 'B' },
    { id: 74, subject: 'Fen Bilimleri', questionNumber: 4, correctAnswer: 'C' },
    { id: 75, subject: 'Fen Bilimleri', questionNumber: 5, correctAnswer: 'D' },
    { id: 76, subject: 'Fen Bilimleri', questionNumber: 6, correctAnswer: 'A' },
    { id: 77, subject: 'Fen Bilimleri', questionNumber: 7, correctAnswer: 'B' },
    { id: 78, subject: 'Fen Bilimleri', questionNumber: 8, correctAnswer: 'C' },
    { id: 79, subject: 'Fen Bilimleri', questionNumber: 9, correctAnswer: 'D' },
    { id: 80, subject: 'Fen Bilimleri', questionNumber: 10, correctAnswer: 'A' },
    { id: 81, subject: 'Fen Bilimleri', questionNumber: 11, correctAnswer: 'B' },
    { id: 82, subject: 'Fen Bilimleri', questionNumber: 12, correctAnswer: 'C' },
    { id: 83, subject: 'Fen Bilimleri', questionNumber: 13, correctAnswer: 'D' },
    { id: 84, subject: 'Fen Bilimleri', questionNumber: 14, correctAnswer: 'A' },
    { id: 85, subject: 'Fen Bilimleri', questionNumber: 15, correctAnswer: 'B' },
    { id: 86, subject: 'Fen Bilimleri', questionNumber: 16, correctAnswer: 'C' },
    { id: 87, subject: 'Fen Bilimleri', questionNumber: 17, correctAnswer: 'D' },
    { id: 88, subject: 'Fen Bilimleri', questionNumber: 18, correctAnswer: 'A' },
    { id: 89, subject: 'Fen Bilimleri', questionNumber: 19, correctAnswer: 'B' },
    { id: 90, subject: 'Fen Bilimleri', questionNumber: 20, correctAnswer: 'C' },
  ]
},
{
  id: 'meb-lgs-3',
  title: 'MEB LGS Denemesi 3',
  description: 'MEB formatında 90 soruluk tam deneme sınavı',
  duration: 135,
  pdfUrls: {
    verbal: 'https://bartinodm.meb.gov.tr/meb_iys_dosyalar/2020_06/18110220_ONLINE_1_SOZ_A.pdf',
    numeric: 'https://bartinodm.meb.gov.tr/meb_iys_dosyalar/2020_06/18110220_ONLINE_1_SAY_A.pdf'
  },
  subjects: [
    { name: 'Türkçe', questionCount: 20, startIndex: 0, pdfType: 'verbal' },
    { name: 'T.C. İnkılap Tarihi', questionCount: 10, startIndex: 20, pdfType: 'verbal' },
    { name: 'Din Kültürü', questionCount: 10, startIndex: 30, pdfType: 'verbal' },
    { name: 'İngilizce', questionCount: 10, startIndex: 40, pdfType: 'verbal' },
    { name: 'Matematik', questionCount: 20, startIndex: 50, pdfType: 'numeric' },
    { name: 'Fen Bilimleri', questionCount: 20, startIndex: 70, pdfType: 'numeric' },
  ],
  questions: [
    // Türkçe (1-20)
    { id: 1, subject: 'Türkçe', questionNumber: 1, correctAnswer: 'B' },
    { id: 2, subject: 'Türkçe', questionNumber: 2, correctAnswer: 'D' },
    { id: 3, subject: 'Türkçe', questionNumber: 3, correctAnswer: 'A' },
    { id: 4, subject: 'Türkçe', questionNumber: 4, correctAnswer: 'C' },
    { id: 5, subject: 'Türkçe', questionNumber: 5, correctAnswer: 'B' },
    { id: 6, subject: 'Türkçe', questionNumber: 6, correctAnswer: 'D' },
    { id: 7, subject: 'Türkçe', questionNumber: 7, correctAnswer: 'A' },
    { id: 8, subject: 'Türkçe', questionNumber: 8, correctAnswer: 'C' },
    { id: 9, subject: 'Türkçe', questionNumber: 9, correctAnswer: 'B' },
    { id: 10, subject: 'Türkçe', questionNumber: 10, correctAnswer: 'D' },
    { id: 11, subject: 'Türkçe', questionNumber: 11, correctAnswer: 'A' },
    { id: 12, subject: 'Türkçe', questionNumber: 12, correctAnswer: 'C' },
    { id: 13, subject: 'Türkçe', questionNumber: 13, correctAnswer: 'B' },
    { id: 14, subject: 'Türkçe', questionNumber: 14, correctAnswer: 'D' },
    { id: 15, subject: 'Türkçe', questionNumber: 15, correctAnswer: 'A' },
    { id: 16, subject: 'Türkçe', questionNumber: 16, correctAnswer: 'C' },
    { id: 17, subject: 'Türkçe', questionNumber: 17, correctAnswer: 'B' },
    { id: 18, subject: 'Türkçe', questionNumber: 18, correctAnswer: 'D' },
    { id: 19, subject: 'Türkçe', questionNumber: 19, correctAnswer: 'A' },
    { id: 20, subject: 'Türkçe', questionNumber: 20, correctAnswer: 'C' },
    // T.C. İnkılap Tarihi (1-10)
    { id: 21, subject: 'T.C. İnkılap Tarihi', questionNumber: 1, correctAnswer: 'D' },
    { id: 22, subject: 'T.C. İnkılap Tarihi', questionNumber: 2, correctAnswer: 'B' },
    { id: 23, subject: 'T.C. İnkılap Tarihi', questionNumber: 3, correctAnswer: 'A' },
    { id: 24, subject: 'T.C. İnkılap Tarihi', questionNumber: 4, correctAnswer: 'C' },
    { id: 25, subject: 'T.C. İnkılap Tarihi', questionNumber: 5, correctAnswer: 'D' },
    { id: 26, subject: 'T.C. İnkılap Tarihi', questionNumber: 6, correctAnswer: 'B' },
    { id: 27, subject: 'T.C. İnkılap Tarihi', questionNumber: 7, correctAnswer: 'A' },
    { id: 28, subject: 'T.C. İnkılap Tarihi', questionNumber: 8, correctAnswer: 'C' },
    { id: 29, subject: 'T.C. İnkılap Tarihi', questionNumber: 9, correctAnswer: 'D' },
    { id: 30, subject: 'T.C. İnkılap Tarihi', questionNumber: 10, correctAnswer: 'B' },
    // Din Kültürü (1-10)
    { id: 31, subject: 'Din Kültürü', questionNumber: 1, correctAnswer: 'C' },
    { id: 32, subject: 'Din Kültürü', questionNumber: 2, correctAnswer: 'A' },
    { id: 33, subject: 'Din Kültürü', questionNumber: 3, correctAnswer: 'B' },
    { id: 34, subject: 'Din Kültürü', questionNumber: 4, correctAnswer: 'D' },
    { id: 35, subject: 'Din Kültürü', questionNumber: 5, correctAnswer: 'C' },
    { id: 36, subject: 'Din Kültürü', questionNumber: 6, correctAnswer: 'A' },
    { id: 37, subject: 'Din Kültürü', questionNumber: 7, correctAnswer: 'B' },
    { id: 38, subject: 'Din Kültürü', questionNumber: 8, correctAnswer: 'D' },
    { id: 39, subject: 'Din Kültürü', questionNumber: 9, correctAnswer: 'C' },
    { id: 40, subject: 'Din Kültürü', questionNumber: 10, correctAnswer: 'A' },
    // İngilizce (1-10)
    { id: 41, subject: 'İngilizce', questionNumber: 1, correctAnswer: 'A' },
    { id: 42, subject: 'İngilizce', questionNumber: 2, correctAnswer: 'C' },
    { id: 43, subject: 'İngilizce', questionNumber: 3, correctAnswer: 'B' },
    { id: 44, subject: 'İngilizce', questionNumber: 4, correctAnswer: 'D' },
    { id: 45, subject: 'İngilizce', questionNumber: 5, correctAnswer: 'A' },
    { id: 46, subject: 'İngilizce', questionNumber: 6, correctAnswer: 'C' },
    { id: 47, subject: 'İngilizce', questionNumber: 7, correctAnswer: 'B' },
    { id: 48, subject: 'İngilizce', questionNumber: 8, correctAnswer: 'D' },
    { id: 49, subject: 'İngilizce', questionNumber: 9, correctAnswer: 'A' },
    { id: 50, subject: 'İngilizce', questionNumber: 10, correctAnswer: 'C' },
    // Matematik (1-20)
    { id: 51, subject: 'Matematik', questionNumber: 1, correctAnswer: 'C' },
    { id: 52, subject: 'Matematik', questionNumber: 2, correctAnswer: 'A' },
    { id: 53, subject: 'Matematik', questionNumber: 3, correctAnswer: 'B' },
    { id: 54, subject: 'Matematik', questionNumber: 4, correctAnswer: 'D' },
    { id: 55, subject: 'Matematik', questionNumber: 5, correctAnswer: 'C' },
    { id: 56, subject: 'Matematik', questionNumber: 6, correctAnswer: 'A' },
    { id: 57, subject: 'Matematik', questionNumber: 7, correctAnswer: 'B' },
    { id: 58, subject: 'Matematik', questionNumber: 8, correctAnswer: 'D' },
    { id: 59, subject: 'Matematik', questionNumber: 9, correctAnswer: 'C' },
    { id: 60, subject: 'Matematik', questionNumber: 10, correctAnswer: 'A' },
    { id: 61, subject: 'Matematik', questionNumber: 11, correctAnswer: 'B' },
    { id: 62, subject: 'Matematik', questionNumber: 12, correctAnswer: 'D' },
    { id: 63, subject: 'Matematik', questionNumber: 13, correctAnswer: 'C' },
    { id: 64, subject: 'Matematik', questionNumber: 14, correctAnswer: 'A' },
    { id: 65, subject: 'Matematik', questionNumber: 15, correctAnswer: 'B' },
    { id: 66, subject: 'Matematik', questionNumber: 16, correctAnswer: 'D' },
    { id: 67, subject: 'Matematik', questionNumber: 17, correctAnswer: 'C' },
    { id: 68, subject: 'Matematik', questionNumber: 18, correctAnswer: 'A' },
    { id: 69, subject: 'Matematik', questionNumber: 19, correctAnswer: 'B' },
    { id: 70, subject: 'Matematik', questionNumber: 20, correctAnswer: 'D' },
    // Fen Bilimleri (1-20)
    { id: 71, subject: 'Fen Bilimleri', questionNumber: 1, correctAnswer: 'C' },
    { id: 72, subject: 'Fen Bilimleri', questionNumber: 2, correctAnswer: 'A' },
    { id: 73, subject: 'Fen Bilimleri', questionNumber: 3, correctAnswer: 'B' },
    { id: 74, subject: 'Fen Bilimleri', questionNumber: 4, correctAnswer: 'D' },
    { id: 75, subject: 'Fen Bilimleri', questionNumber: 5, correctAnswer: 'C' },
    { id: 76, subject: 'Fen Bilimleri', questionNumber: 6, correctAnswer: 'A' },
    { id: 77, subject: 'Fen Bilimleri', questionNumber: 7, correctAnswer: 'B' },
    { id: 78, subject: 'Fen Bilimleri', questionNumber: 8, correctAnswer: 'D' },
    { id: 79, subject: 'Fen Bilimleri', questionNumber: 9, correctAnswer: 'C' },
    { id: 80, subject: 'Fen Bilimleri', questionNumber: 10, correctAnswer: 'A' },
    { id: 81, subject: 'Fen Bilimleri', questionNumber: 11, correctAnswer: 'B' },
    { id: 82, subject: 'Fen Bilimleri', questionNumber: 12, correctAnswer: 'D' },
    { id: 83, subject: 'Fen Bilimleri', questionNumber: 13, correctAnswer: 'C' },
    { id: 84, subject: 'Fen Bilimleri', questionNumber: 14, correctAnswer: 'A' },
    { id: 85, subject: 'Fen Bilimleri', questionNumber: 15, correctAnswer: 'B' },
    { id: 86, subject: 'Fen Bilimleri', questionNumber: 16, correctAnswer: 'D' },
    { id: 87, subject: 'Fen Bilimleri', questionNumber: 17, correctAnswer: 'C' },
    { id: 88, subject: 'Fen Bilimleri', questionNumber: 18, correctAnswer: 'A' },
    { id: 89, subject: 'Fen Bilimleri', questionNumber: 19, correctAnswer: 'B' },
    { id: 90, subject: 'Fen Bilimleri', questionNumber: 20, correctAnswer: 'D' },
  ]
}
];

export function MockExamView({ onBack }: MockExamViewProps) {
  const [phase, setPhase] = useState<ExamPhase>('list');
  const [currentExam, setCurrentExam] = useState<ExamData | null>(null);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = (exam: ExamData) => {
    setCurrentExam(exam);
    setAnswers({});
    setTimeRemaining(exam.duration * 60);
    setIsTimerRunning(true);
    setCurrentSubjectIndex(0);
    setPhase('exam');
  };

  const handleAnswer = (questionId: number, answer: AnswerState) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: prev[questionId] === answer ? 'empty' : answer
    }));
  };

  const handleFinishExam = useCallback(() => {
    setIsTimerRunning(false);
    setPhase('result');
    
    // Calculate results
    if (currentExam) {
      const results = calculateResults();
      if (results.percentage >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [currentExam, answers]);

  const calculateResults = () => {
    if (!currentExam) return { correct: 0, wrong: 0, empty: 0, net: 0, percentage: 0, subjectResults: [] };

    let correct = 0;
    let wrong = 0;
    let empty = 0;

    const subjectResults = currentExam.subjects.map(subject => {
      let subjectCorrect = 0;
      let subjectWrong = 0;
      let subjectEmpty = 0;

      currentExam.questions
        .filter(q => q.subject === subject.name)
        .forEach(q => {
          const userAnswer = answers[q.id];
          if (!userAnswer || userAnswer === 'empty') {
            subjectEmpty++;
            empty++;
          } else if (userAnswer === q.correctAnswer) {
            subjectCorrect++;
            correct++;
          } else {
            subjectWrong++;
            wrong++;
          }
        });

      const subjectNet = subjectCorrect - (subjectWrong / 3);
      
      return {
        name: subject.name,
        correct: subjectCorrect,
        wrong: subjectWrong,
        empty: subjectEmpty,
        total: subject.questionCount,
        net: subjectNet,
        percentage: (subjectCorrect / subject.questionCount) * 100
      };
    });

    const net = correct - (wrong / 3);
    const percentage = (correct / currentExam.questions.length) * 100;

    return { correct, wrong, empty, net, percentage, subjectResults };
  };

  const getWeakSubjects = () => {
    const results = calculateResults();
    return results.subjectResults
      .filter(s => s.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage);
  };

  // Exam List View
  if (phase === 'list') {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri
          </Button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-info to-primary rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Deneme Sınavları</h1>
              <p className="text-muted-foreground">LGS formatında tam deneme sınavları</p>
            </div>
          </div>

          <div className="space-y-4">
            {mockExams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startExam(exam)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{exam.title}</h3>
                      <p className="text-muted-foreground mb-4">{exam.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {exam.subjects.map(s => (
                          <Badge key={s.name} variant="secondary">
                            {s.name} ({s.questionCount})
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {exam.duration} dakika
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {exam.questions.length} soru
                        </span>
                      </div>
                    </div>

                    <Button size="lg" className="ml-4">
                      <Play className="w-5 h-5 mr-2" />
                      Başla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Mascot 
              size="md" 
              mood="encouraging" 
              message="Gerçek sınav deneyimi için hazır mısın? 💪"
            />
          </div>
        </div>
      </div>
    );
  }

  // Exam View
  if (phase === 'exam' && currentExam) {
    const currentSubject = currentExam.subjects[currentSubjectIndex];
    const subjectQuestions = currentExam.questions.filter(q => q.subject === currentSubject.name);
    const answeredCount = Object.values(answers).filter(a => a && a !== 'empty').length;
    const currentPdfUrl = currentExam.pdfUrls[currentSubject.pdfType];

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
          <div className="max-w-full mx-auto flex items-center justify-between px-4">
            <div>
              <h2 className="font-bold">{currentExam.title}</h2>
              <p className="text-sm text-muted-foreground">
                {answeredCount} / {currentExam.questions.length} cevaplandı
              </p>
            </div>

            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold",
              timeRemaining < 300 ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
            )}>
              <Clock className="w-5 h-5" />
              {formatTime(timeRemaining)}
            </div>

            <Button variant="destructive" onClick={handleFinishExam}>
              Sınavı Bitir
            </Button>
          </div>
        </div>

        {/* Subject Tabs */}
        <div className="bg-card border-b border-border">
          <div className="max-w-full mx-auto px-4">
            <ScrollArea className="w-full">
              <div className="flex gap-1 p-2">
                {currentExam.subjects.map((subject, idx) => {
                  const subjectAnswered = currentExam.questions
                    .filter(q => q.subject === subject.name)
                    .filter(q => answers[q.id] && answers[q.id] !== 'empty').length;

                  return (
                    <Button
                      key={subject.name}
                      variant={currentSubjectIndex === idx ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentSubjectIndex(idx)}
                      className="whitespace-nowrap"
                    >
                      {subject.name}
                      <Badge variant="secondary" className="ml-2">
                        {subjectAnswered}/{subject.questionCount}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content: PDF + Answer Grid */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* PDF Viewer */}
          <div className="flex-1 h-[50vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-border">
            <iframe
              src={`${currentPdfUrl}#toolbar=1&navpanes=0`}
              className="w-full h-full"
              title="Sınav PDF"
            />
          </div>

          {/* Answer Grid */}
          <div className="w-full lg:w-80 xl:w-96 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {currentSubject.name} - Cevap Anahtarı
                </h3>
                
                <div className="space-y-2">
                  {subjectQuestions.map(q => (
                    <div key={q.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <span className="w-12 text-sm font-bold text-muted-foreground">
                        S.{q.questionNumber}
                      </span>
                      <div className="flex gap-1 flex-1">
                        {(['A', 'B', 'C', 'D'] as const).map(option => (
                          <Button
                            key={option}
                            variant={answers[q.id] === option ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 w-8 p-0 font-bold"
                            onClick={() => handleAnswer(q.id, option)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-6 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentSubjectIndex === 0}
                    onClick={() => setCurrentSubjectIndex(prev => prev - 1)}
                  >
                    Önceki
                  </Button>
                  
                  {currentSubjectIndex < currentExam.subjects.length - 1 ? (
                    <Button size="sm" onClick={() => setCurrentSubjectIndex(prev => prev + 1)}>
                      Sonraki
                    </Button>
                  ) : (
                    <Button variant="destructive" size="sm" onClick={handleFinishExam}>
                      Bitir
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (phase === 'result' && currentExam) {
    const results = calculateResults();
    const weakSubjects = getWeakSubjects();

    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => setPhase('list')} className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Sınavlara Dön
          </Button>

          {/* Summary Card */}
          <Card className="mb-6 animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Mascot 
                  size="lg" 
                  mood={results.percentage >= 70 ? 'celebrating' : results.percentage >= 50 ? 'happy' : 'encouraging'}
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    {results.percentage >= 70 ? 'Harika İş!' : results.percentage >= 50 ? 'İyi Gidiyorsun!' : 'Çalışmaya Devam!'}
                  </h2>
                  <p className="text-muted-foreground">{currentExam.title} tamamlandı</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-success/20 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-success" />
                  <div className="text-2xl font-bold text-success">{results.correct}</div>
                  <div className="text-xs text-muted-foreground">Doğru</div>
                </div>
                <div className="bg-destructive/20 rounded-xl p-4 text-center">
                  <XCircle className="w-6 h-6 mx-auto mb-2 text-destructive" />
                  <div className="text-2xl font-bold text-destructive">{results.wrong}</div>
                  <div className="text-xs text-muted-foreground">Yanlış</div>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <MinusCircle className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-2xl font-bold">{results.empty}</div>
                  <div className="text-xs text-muted-foreground">Boş</div>
                </div>
                <div className="bg-primary/20 rounded-xl p-4 text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-primary">{results.net.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Net</div>
                </div>
              </div>

              <Progress value={results.percentage} className="h-3 mb-2" />
              <p className="text-center text-sm text-muted-foreground">
                Başarı oranı: %{results.percentage.toFixed(1)}
              </p>
            </CardContent>
          </Card>

          {/* Subject Breakdown */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Ders Bazlı Sonuçlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.subjectResults.map(subject => (
                  <div key={subject.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subject.name}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-success">{subject.correct} D</span>
                        <span className="text-destructive">{subject.wrong} Y</span>
                        <span className="text-muted-foreground">{subject.empty} B</span>
                        <span className="font-bold">{subject.net.toFixed(2)} Net</span>
                      </div>
                    </div>
                    <Progress 
                      value={subject.percentage} 
                      className={cn(
                        "h-2",
                        subject.percentage < 50 && "[&>div]:bg-destructive"
                      )} 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weak Subjects Warning */}
          {weakSubjects.length > 0 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  Eksik Konularınız
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Bu derslerde %50'nin altında başarı gösterdiniz. Bu konulara daha fazla çalışmanızı öneririz:
                </p>
                <div className="flex flex-wrap gap-2">
                  {weakSubjects.map(subject => (
                    <Badge key={subject.name} variant="outline" className="border-warning text-warning">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {subject.name} (%{subject.percentage.toFixed(0)})
                    </Badge>
                  ))}
                </div>
                <Button className="mt-4 w-full" variant="outline" onClick={onBack}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Derslere Git ve Çalış
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return null;
}
