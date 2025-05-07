import { prisma } from '../lib/prisma';

const lobbies = [
  {
    name: "Wellness Basics",
    description: "Prioritizing physical and mental well-being forms a strong foundation for women's empowerment and overall health.",
    slug: "wellness-basics",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/wellness-basics.png",
    categories: ["Wellness"]
  },
  {
    name: "Relationship Dynamics",
    description: "Understanding healthy relationship patterns empowers women to build fulfilling and equitable connections.",
    slug: "relationship-dynamics",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/relationship-dynamics.png",
    categories: ["Relationships"]
  },
  {
    name: "Lead Like Her",
    description: "This explores diverse leadership styles and empowers women to embrace their unique strengths in leading.",
    slug: "lead-like-her",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/lead-like-her.png",
    categories: ["Leadership"]
  },
  {
    name: "Boundaries 101",
    description: "Understanding and establishing healthy boundaries is crucial for women's well-being and empowerment in all aspects of life.",
    slug: "boundaries-101",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/bounderies-101.png",
    categories: ["Personal Development"]
  },
  {
    name: "Heal & Rise",
    description: "This focuses on emotional healing and resilience, empowering women to overcome challenges and thrive.",
    slug: "heal-and-rise",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/heal-and-rice.png",
    categories: ["Healing"]
  },
  {
    name: "Money Wise",
    description: "Financial literacy and empowerment enable women to achieve economic independence and security.",
    slug: "money-wise",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/money-wise.png",
    categories: ["Finance"]
  },
  {
    name: "Confident Communication",
    description: "Developing assertive and clear communication skills empowers women to express their needs and ideas effectively.",
    slug: "confident-communication",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/confident-communication.png",
    categories: ["Communication"]
  },
  {
    name: "Home & Auto Skills",
    description: "Practical skills in home maintenance and basic car care promote self-reliance and reduce dependence.",
    slug: "home-and-auto-skills",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/home-and-autoskill.png",
    categories: ["Life Skills"]
  },
  {
    name: "Digital Fluency",
    description: "Proficiency in digital technologies opens up vast opportunities for learning, connection, and career advancement for women.",
    slug: "digital-fluency",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/digital-fluency.png",
    categories: ["Technology"]
  },
  {
    name: "Freelance Toolkit",
    description: "This equips women with the knowledge and resources to navigate the world of freelancing and build their own businesses.",
    slug: "freelance-toolkit",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/freelnace-toolkit.png",
    categories: ["Freelancing"]
  },
  {
    name: "Survival Basics",
    description: "Essential survival skills enhance women's safety, preparedness, and confidence in various situations.",
    slug: "survival-basics",
    thumbnail: "https://herfriends.s3.ap-southeast-1.amazonaws.com/lobbies/survival-basics.png",
    categories: ["Survival"]
  }
];

function getRandomViewerCount() {
  return Math.floor(Math.random() * 1001); // 0 to 1000
}

async function main() {
  for (const [index, lobby] of lobbies.entries()) {
    const type = index < 5 ? 'VOICE_LOBBY' : 'VIDEO_LOBBY';
    await prisma.lobby.upsert({
      where: { slug: lobby.slug },
      update: {
        ...lobby,
        host: {},
        coHosts: [],
        isPrivate: false,
        isActive: true,
        isLive: true,
        order: index + 1,
        viewerCount: getRandomViewerCount(),
        type,
        categories: lobby.categories,
      },
      create: {
        ...lobby,
        host: {},
        coHosts: [],
        isPrivate: false,
        isActive: true,
        isLive: true,
        order: index + 1,
        viewerCount: getRandomViewerCount(),
        type,
        categories: lobby.categories,
      },
    });
    console.log(`Upserted lobby: ${lobby.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });