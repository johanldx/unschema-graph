import {
  Book,
  Clip,
  Comment,
  Course,
  DiscussionForumPosting,
  HowTo,
  HowToStep,
  JobPosting,
  Movie,
  Offer,
  Organization,
  Person,
  PostalAddress,
  ProfilePage,
  QAPage,
  Recipe,
  SchemaValidationError,
  Service,
  VacationRental,
  VideoObject,
  WebApplication,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('Advanced & Sectoral Schemas (12 Pack)', () => {
  describe('Recipe', () => {
    it('creates a valid Recipe with ingredients and instructions', () => {
      const recipe = Recipe({
        name: 'Tarte aux Pommes Maison',
        image: 'https://cuisine.fr/tarte.jpg',
        recipeIngredient: ['4 pommes', '200g de pâte brisée', '50g de sucre'],
        recipeInstructions: [
          'Éplucher les pommes.',
          'Disposer les lamelles sur la pâte.',
          'Enfourner 30 minutes à 180°C.',
        ],
        prepTime: 'PT15M',
        cookTime: 'PT30M',
        recipeYield: '6 personnes',
        nutrition: {
          calories: '280 calories',
        },
      });

      expect(recipe['@type']).toBe('Recipe');
      expect(recipe.name).toBe('Tarte aux Pommes Maison');
      expect(recipe.recipeIngredient).toHaveLength(3);
      expect(recipe.recipeInstructions).toEqual([
        { '@type': 'HowToStep', text: 'Éplucher les pommes.' },
        { '@type': 'HowToStep', text: 'Disposer les lamelles sur la pâte.' },
        { '@type': 'HowToStep', text: 'Enfourner 30 minutes à 180°C.' },
      ]);
      expect(recipe.nutrition?.calories).toBe('280 calories');
    });

    it('throws when required image or ingredients are missing', () => {
      expect(() =>
        // @ts-expect-error Missing image and ingredients
        Recipe({ name: 'Empty Recipe' })
      ).toThrowError(SchemaValidationError);
    });
  });

  describe('HowTo & HowToStep', () => {
    it('creates a HowTo guide with step entities', () => {
      const howto = HowTo({
        name: 'Comment vidanger un radiateur',
        step: [
          HowToStep({ text: 'Éteindre la chaudière.' }),
          HowToStep({ text: 'Ouvrir le purgeur avec une clé.' }),
        ],
        totalTime: 'PT10M',
      });

      expect(howto['@type']).toBe('HowTo');
      expect(howto.step).toHaveLength(2);
      expect(howto.step[0]).toEqual({
        '@type': 'HowToStep',
        text: 'Éteindre la chaudière.',
      });
    });
  });

  describe('VideoObject & Clip', () => {
    it('creates a valid VideoObject with thumbnail and duration', () => {
      const video = VideoObject({
        name: 'Astro 5 Crash Course',
        description: 'Apprendre Astro en 20 minutes.',
        thumbnailUrl: 'https://video.fr/thumb.jpg',
        uploadDate: '2026-09-28T10:00:00Z',
        duration: 'PT20M',
        embedUrl: 'https://youtube.com/embed/xyz',
        hasPart: Clip({
          name: 'Introduction aux Îles Astro',
          startOffset: 60,
          endOffset: 240,
        }),
      });

      expect(video['@type']).toBe('VideoObject');
      expect(video.duration).toBe('PT20M');
      expect(video.hasPart).toEqual({
        '@type': 'Clip',
        name: 'Introduction aux Îles Astro',
        startOffset: 60,
        endOffset: 240,
      });
    });
  });

  describe('Course', () => {
    it('creates a valid Course entity with provider', () => {
      const course = Course({
        name: 'Mastering TypeScript & Astro',
        description: 'Formation complète pour architectes frontend.',
        provider: Organization({
          name: 'Rootage Academy',
          url: 'https://rootage.fr',
        }),
        offers: Offer({
          price: 199,
          priceCurrency: 'EUR',
        }),
      });

      expect(course['@type']).toBe('Course');
      expect(course.provider).toEqual({
        '@type': 'Organization',
        name: 'Rootage Academy',
        url: 'https://rootage.fr',
      });
    });
  });

  describe('ProfilePage', () => {
    it('creates a ProfilePage entity linked to a Person', () => {
      const profile = ProfilePage({
        name: 'Profil de Johan Ledoux',
        url: 'https://mon-site.fr/auteurs/johan',
        mainEntity: Person({
          name: 'Johan Ledoux',
          jobTitle: 'Consultant SEO & Astro',
        }),
      });

      expect(profile['@type']).toBe('ProfilePage');
      expect(profile.mainEntity).toEqual({
        '@type': 'Person',
        name: 'Johan Ledoux',
        jobTitle: 'Consultant SEO & Astro',
      });
    });
  });

  describe('QAPage, DiscussionForumPosting, Comment', () => {
    it('creates a QAPage with question and accepted answer', () => {
      const qa = QAPage({
        mainEntity: {
          name: 'Comment optimiser les Core Web Vitals sur Astro ?',
          text: 'Quels sont les bons réglages pour un LCP sous 1 seconde ?',
          acceptedAnswer: {
            text: 'Utiliser astro/assets pour compresser les images au format WebP.',
          },
        },
      });

      expect(qa['@type']).toBe('QAPage');
      expect(qa.mainEntity.name).toBe('Comment optimiser les Core Web Vitals sur Astro ?');
    });

    it('creates a DiscussionForumPosting with comments', () => {
      const forumPost = DiscussionForumPosting({
        headline: 'Vos retours sur unschema-graph ?',
        author: 'DevUser',
        datePublished: '2026-09-28',
        comment: [
          Comment({
            text: 'Super package, très fluide !',
            author: 'Jane',
            upvoteCount: 12,
          }),
        ],
      });

      expect(forumPost['@type']).toBe('DiscussionForumPosting');
      expect(forumPost.comment).toEqual([
        {
          '@type': 'Comment',
          text: 'Super package, très fluide !',
          author: {
            '@type': 'Person',
            name: 'Jane',
          },
          upvoteCount: 12,
        },
      ]);
    });
  });

  describe('Book & Movie', () => {
    it('creates a valid Book entity with author and ISBN', () => {
      const book = Book({
        name: 'Architecture Logicielle Moderne',
        author: 'Johan Ledoux',
        isbn: '978-2-1234-5680-3',
        numberOfPages: 350,
      });

      expect(book['@type']).toBe('Book');
      expect(book.isbn).toBe('978-2-1234-5680-3');
    });

    it('creates a valid Movie entity with director', () => {
      const movie = Movie({
        name: 'Inception',
        director: 'Christopher Nolan',
        duration: 'PT2H28M',
      });

      expect(movie['@type']).toBe('Movie');
      expect(movie.director).toBe('Christopher Nolan');
    });
  });

  describe('JobPosting', () => {
    it('creates a valid JobPosting for Google for Jobs', () => {
      const job = JobPosting({
        title: 'Lead Développeur Astro / TypeScript',
        description: '<p>Nous recrutons un Lead Dev passionné par la performance.</p>',
        datePosted: '2026-09-28',
        hiringOrganization: Organization({
          name: 'Rootage',
          url: 'https://rootage.fr',
        }),
        jobLocationType: 'TELECOMMUTE', // Remote
        baseSalary: {
          currency: 'EUR',
          value: {
            minValue: 55000,
            maxValue: 70000,
            unitText: 'YEAR',
          },
        },
      });

      expect(job['@type']).toBe('JobPosting');
      expect(job.title).toBe('Lead Développeur Astro / TypeScript');
      expect(job.jobLocationType).toBe('TELECOMMUTE');
      expect(job.hiringOrganization).toEqual({
        '@type': 'Organization',
        name: 'Rootage',
        url: 'https://rootage.fr',
      });
    });
  });

  describe('SoftwareApplication & WebApplication', () => {
    it('creates a valid SoftwareApplication and WebApplication', () => {
      const saas = WebApplication({
        name: 'SEO Graph Analyzer',
        applicationCategory: 'BusinessApplication',
        offers: Offer({
          price: 29,
          priceCurrency: 'EUR',
        }),
      });

      expect(saas['@type']).toBe('WebApplication');
      expect(saas.name).toBe('SEO Graph Analyzer');
      expect(saas.applicationCategory).toBe('BusinessApplication');
    });
  });

  describe('Service', () => {
    it('creates a valid Service entity', () => {
      const service = Service({
        name: 'Audit SEO Technique Astro',
        serviceType: 'Consulting',
        provider: Organization({ name: 'Rootage' }),
        areaServed: 'France',
      });

      expect(service['@type']).toBe('Service');
      expect(service.serviceType).toBe('Consulting');
      expect(service.provider).toEqual({
        '@type': 'Organization',
        name: 'Rootage',
      });
    });
  });

  describe('LodgingBusiness & VacationRental', () => {
    it('creates a VacationRental lodging entity', () => {
      const gite = VacationRental({
        name: 'Le Mas Provençal',
        address: PostalAddress({
          addressLocality: 'Gordes',
          postalCode: '84220',
          addressCountry: 'FR',
        }),
        numberOfRooms: 4,
        checkinTime: '16:00',
        checkoutTime: '11:00',
        petsAllowed: true,
      });

      expect(gite['@type']).toBe('VacationRental');
      expect(gite.numberOfRooms).toBe(4);
      expect(gite.petsAllowed).toBe(true);
    });
  });
});
