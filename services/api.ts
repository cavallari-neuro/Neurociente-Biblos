
import { Module, Tenant, LessonStatus, UserProgress, IncentiveState, CommunityMember, CommunityGlobalStatus, Echo, CommunityGoal } from '../types.ts';

// Simulating database/API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTenantContext = async (): Promise<Tenant> => {
  await delay(600);
  return {
    id: 'tnt_123',
    name: 'Instituto Bíblico Vida',
    type: 'CHURCH',
    primaryColor: '#2C3E50',
    leaderName: 'Pr. Marcelo Oliveira',
    leaderTitle: 'Pastor Senior',
    weeklyMessage: 'Que a semana seja de renovo e aprendizado profundo na Palavra.',
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
          status: LessonStatus.AVAILABLE,
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
    currentStreak: 5,
    totalInsights: 12,
    lastInsightQuality: 'S' // Simulating a high quality insight for testing
  };
};

// Mock Incentives Status for the Current User
export const fetchUserIncentives = async (): Promise<IncentiveState[]> => {
    await delay(600);
    // Logic based on "mock" state
    return [
        {
            id: 'inc_1',
            type: 'DAILY_MISSION',
            label: 'Missão do Dia',
            description: 'Concluída',
            isUnlocked: true,
            isSent: false,
            value: 10
        },
        {
            id: 'inc_2',
            type: 'STREAK_KEEPER',
            label: 'Guardião do Ritmo',
            description: '5 dias seguidos',
            isUnlocked: true,
            isSent: true, // Already sent today
            value: 20
        },
        {
            id: 'inc_3',
            type: 'INSIGHT_MASTER',
            label: 'Insight Profundo',
            description: 'Insight nota S',
            isUnlocked: true, 
            isSent: false,
            value: 50
        }
    ];
};

export const fetchCommunityMembers = async (): Promise<CommunityMember[]> => {
  await delay(1200);

  const names = [
    "Ana Silva", "Lucas M.", "João Pedro", "Beatriz C.", "Mariana R.", 
    "Carlos E.", "Fernanda S.", "Você", "Gustavo L.", "Juliana P.",
    "Rafael T.", "Camila B.", "Bruno D.", "Larissa M.", "Rodrigo F.",
    "Patrícia A.", "Felipe S.", "Tatiane O.", "Marcelo V.", "Diego R."
  ];

  return names.map((name, index) => {
    // Generate loosely correlated stats
    const incentives = Math.floor(150 - (index * 5) + Math.random() * 10);
    const books = Math.floor(incentives / 4) + 2; 
    const verses = Math.floor(20 + Math.random() * 30);
    
    return {
        userId: `u_${index}`,
        name: name,
        rank: index + 1,
        avatarColor: ['#CFB53B', '#CD7F32', '#008080', '#FF7F50', '#1A1A1A'][index % 5],
        incentivesSent: incentives,
        booksRead: books,
        versesPerDay: verses,
        likesReceived: Math.floor(Math.random() * 50),
        isLikedByCurrentUser: false
    };
  });
};

const getRandomColor = () => ['#CFB53B', '#CD7F32', '#008080', '#FF7F50', '#1A1A1A'][Math.floor(Math.random() * 5)];
const messages = ["Amém!", "Que forte", "Lendo...", "Refletindo", "Paz", "Uau", "Profundo", "Seguindo"];

const generateAvatars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `avt_${Math.random()}`,
        initial: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
        color: getRandomColor(),
        message: Math.random() > 0.7 ? messages[Math.floor(Math.random() * messages.length)] : undefined
    }));
};

export const fetchCommunityGlobalStatus = async (): Promise<CommunityGlobalStatus> => {
    await delay(700);
    
    return {
        totalOnline: 342,
        activeClusters: [
            {
                bookName: "Lucas",
                totalReaders: 124,
                activeAvatars: generateAvatars(12),
                recentInsights: 45
            },
            {
                bookName: "Salmos",
                totalReaders: 86,
                activeAvatars: generateAvatars(8),
                recentInsights: 22
            },
            {
                bookName: "Gênesis",
                totalReaders: 42,
                activeAvatars: generateAvatars(6),
                recentInsights: 10
            },
            {
                bookName: "Mateus",
                totalReaders: 38,
                activeAvatars: generateAvatars(5),
                recentInsights: 8
            },
            {
                bookName: "Provérbios",
                totalReaders: 25,
                activeAvatars: generateAvatars(4),
                recentInsights: 15
            }
        ]
    };
};

export const fetchCommunityEchoes = async (): Promise<Echo[]> => {
    await delay(800);
    
    const CURRENT_USER_REF = "Lucas 1:5-25";

    // 1. The Current User (Center of the Universe for the map)
    const currentUserEcho: Echo = {
        id: 'echo_me',
        userName: 'Você',
        userAvatarColor: '#1A1A1A',
        timestamp: 'Agora',
        bibleReference: CURRENT_USER_REF,
        content: 'Refletindo sobre a fidelidade de Deus no tempo de espera.',
        reactions: { amem: 0, luz: 0, caminho: 0 },
        isCurrentUser: true
    };

    // 2. High relevance echoes (Same Reference) - "Neighbors"
    const sameRefEchoes: Echo[] = [
        {
            id: 'echo_neighbor_1',
            userName: 'Mariana R.',
            userAvatarColor: '#FF7F50',
            timestamp: '5min atrás',
            bibleReference: CURRENT_USER_REF, // Same as user
            content: 'Impressionante como Isabel e Zacarias esperaram.',
            reactions: { amem: 5, luz: 2, caminho: 0 }
        },
        {
            id: 'echo_neighbor_2',
            userName: 'Carlos E.',
            userAvatarColor: '#008080',
            timestamp: '12min atrás',
            bibleReference: CURRENT_USER_REF, // Same as user
            content: 'O silêncio de Deus não é ausência.',
            reactions: { amem: 12, luz: 4, caminho: 1 }
        },
        {
            id: 'echo_neighbor_3',
            userName: 'Beatriz C.',
            userAvatarColor: '#CFB53B',
            timestamp: '20min atrás',
            bibleReference: CURRENT_USER_REF,
            content: 'Lucas detalha muito bem a história.',
            reactions: { amem: 3, luz: 0, caminho: 0 }
        },
        {
            id: 'echo_neighbor_4',
            userName: 'Felipe S.',
            userAvatarColor: '#CD7F32',
            timestamp: '1h atrás',
            bibleReference: CURRENT_USER_REF,
            content: 'Orando por quem espera uma promessa.',
            reactions: { amem: 25, luz: 10, caminho: 2 }
        }
    ];

    // 3. Featured / Popular echoes (Random references)
    const featuredEchoes: Echo[] = [
        {
            id: 'echo_feat_1',
            userName: 'Fernanda Lima',
            userAvatarColor: '#CFB53B',
            timestamp: '5h atrás',
            bibleReference: 'Mateus 5:14',
            content: 'Somos a luz do mundo. Que responsabilidade imensa.',
            reactions: { amem: 88, luz: 42, caminho: 15 }, 
            userReaction: 'LUZ'
        },
        {
            id: 'echo_feat_2',
            userName: 'João Pedro',
            userAvatarColor: '#008080',
            timestamp: '4h atrás',
            bibleReference: 'Salmos 23',
            content: 'O Senhor é meu pastor. Simples assim.',
            reactions: { amem: 45, luz: 8, caminho: 10 }
        }
    ];

    // 4. Generate filler echoes (Random)
    const fillerContents = [
        "A gratidão muda tudo.", "Hoje aprendi sobre perdão.", "Deus é fiel em todo tempo.",
        "A paz que excede todo entendimento.", "Orando por todos vocês.", "Versículo do dia tocou meu coração.",
        "Lendo Lucas pela primeira vez.", "Que estudo maravilhoso!", "Deus fala no silêncio.",
        "Fortalecido pela Palavra.", "Amando essa jornada.", "A comunhão é essencial."
    ];
    
    const fillerNames = ["Ana", "Pedro", "Lucas", "Maria", "Sofia", "Gabriel", "Julia", "Rafael", "Larissa", "Tiago", "Rebeca", "Daniel", "Ester", "Bruno", "Carla", "Diego"];

    const generatedEchoes: Echo[] = Array.from({ length: 42 }).map((_, i) => ({
        id: `echo_gen_${i}`,
        userName: fillerNames[i % fillerNames.length] + ` ${String.fromCharCode(65 + i)}`,
        userAvatarColor: getRandomColor(),
        timestamp: `${Math.floor(Math.random() * 12) + 1}h atrás`,
        bibleReference: i % 3 === 0 ? `Salmos ${10 + i}` : `Gênesis ${1 + i}:1`,
        content: fillerContents[i % fillerContents.length],
        reactions: {
            amem: Math.floor(Math.random() * 15),
            luz: Math.floor(Math.random() * 5),
            caminho: Math.floor(Math.random() * 2)
        }
    }));

    // Combine all
    return [currentUserEcho, ...sameRefEchoes, ...featuredEchoes, ...generatedEchoes];
};

export const fetchCommunityGoal = async (): Promise<CommunityGoal> => {
    await delay(500);
    return {
        title: 'Maratona de Lucas',
        percentage: 65,
        currentValue: 13500,
        targetValue: 20000,
        unit: 'Versículos',
        weeklyStats: {
            totalMinutesRead: 4520,
            activeParticipants: 342,
            insightsShared: 128
        }
    };
};
