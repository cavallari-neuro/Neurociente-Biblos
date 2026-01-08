import { Module, Tenant, LessonStatus, UserProgress } from '../types';

// Simulating database/API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTenantContext = async (): Promise<Tenant> => {
  await delay(600);
  return {
    id: 'tnt_123',
    name: 'Colégio Presbiteriano Mackenzie',
    type: 'SCHOOL',
    primaryColor: '#BF0000', // Example school color
  };
};

export const fetchJourneyData = async (): Promise<Module[]> => {
  await delay(800);
  return [
    {
      id: 'mod_1',
      title: 'O Início da Jornada',
      description: 'Fundamentos dos Evangelhos',
      lessons: [
        {
          id: 'les_1',
          title: 'O Propósito de Lucas',
          reference: 'Lucas 1:1-4',
          pageNumber: 1042,
          durationMinutes: 5,
          status: LessonStatus.COMPLETED,
          description: 'Entendendo a dedicação de Lucas a Teófilo e o método de investigação histórica.',
          videoUrl: 'https://picsum.photos/800/450' 
        },
        {
          id: 'les_2',
          title: 'O Anúncio a Zacarias',
          reference: 'Lucas 1:5-25',
          pageNumber: 1043,
          durationMinutes: 6,
          status: LessonStatus.AVAILABLE, // This is the next one
          description: 'O silêncio de 400 anos é quebrado com a promessa do nascimento de João Batista.',
          videoUrl: 'https://picsum.photos/800/450'
        },
        {
          id: 'les_3',
          title: 'O Anúncio a Maria',
          reference: 'Lucas 1:26-38',
          pageNumber: 1044,
          durationMinutes: 7,
          status: LessonStatus.LOCKED,
          description: 'A resposta de fé que mudou a história da humanidade.',
        }
      ]
    },
    {
      id: 'mod_2',
      title: 'O Messias Revelado',
      description: 'Os primeiros milagres e ensinamentos',
      lessons: [
        {
          id: 'les_4',
          title: 'O Nascimento',
          reference: 'Lucas 2:1-20',
          pageNumber: 1045,
          durationMinutes: 8,
          status: LessonStatus.LOCKED,
          description: 'Glória a Deus nas alturas e paz na terra.',
        }
      ]
    }
  ];
};

export const fetchUserProgress = async (): Promise<UserProgress> => {
  await delay(400);
  return {
    userId: 'usr_999',
    completedLessonIds: ['les_1'],
    currentStreak: 3,
    totalInsights: 12
  };
};