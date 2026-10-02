import type {
  // Builders & Schemas
  AggregateOfferSchema,
  AggregateRatingSchema,
  AnswerSchema,
  ArticleSchema,
  BookSchema,
  BreadcrumbListSchema,
  ClipSchema,
  CommentSchema,
  ContactPointSchema,
  CourseSchema,
  DataDownloadSchema,
  DatasetSchema,
  DiscussionForumPostingSchema,
  // Graph resolution
  DuplicateStrategy,
  // Temporal / duration
  DurationInput,
  DurationObject,
  // Types
  EntityIdReference,
  EntityReference,
  // Reference & SearchAction
  EntityRefOptions,
  EventSchema,
  FAQPageSchema,
  GeoCoordinatesSchema,
  GoogleArticleSchema,
  GoogleRecipeSchema,
  GraphDiagnostic,
  GraphOptions,
  HowToSchema,
  HowToSectionSchema,
  HowToStepSchema,
  ImageObjectSchema,
  ItemListSchema,
  JobPostingSchema,
  ListItemSchema,
  LocalBusinessSchema,
  LodgingBusinessSchema,
  MovieSchema,
  OfferSchema,
  OpeningHoursSpecificationSchema,
  PersonSchema,
  PostalAddressSchema,
  ProductSchema,
  ProfilePageSchema,
  QAPageSchema,
  QAQuestionSchema,
  QuestionSchema,
  RatingSchema,
  RecipeSchema,
  RestaurantSchema,
  ReviewSchema,
  // Schema definition & extension
  SchemaBuilder,
  SchemaDiagnostic,
  SchemaGraphOptions,
  SchemaInput,
  SchemaOrgEntity,
  SchemaOutput,
  SchemaProps,
  SchemaValidationErrorCode,
  SchemaValidationIssue,
  SchemaValidationResult,
  SearchActionOptions,
  // Serialization
  SerializeOptions,
  ServiceSchema,
  Severity,
  SoftwareApplicationSchema,
  ValidationOptions,
  VideoObjectSchema,
  WebPageSchema,
  WebSiteSchema,
} from '@unschema-graph/core';

import {
  // 51 Builders + 2 Google Profile Builders
  AggregateOffer,
  AggregateRating,
  Answer,
  Article,
  // Temporal
  addDuration,
  BlogPosting,
  Book,
  BreadcrumbList,
  // Graph resolution
  buildJsonLdGraph,
  Clip,
  Comment,
  ContactPoint,
  Course,
  createSearchAction,
  DataDownload,
  Dataset,
  DiscussionForumPosting,
  DuplicateEntityError,
  // Schema definition & extension
  defineSchema,
  diffDuration,
  Event,
  // Common helpers
  entityRef,
  // Serialization
  escapeJsonLd,
  FAQPage,
  formatIsoDate,
  formatIsoDuration,
  GeoCoordinates,
  GoogleArticle,
  GoogleRecipe,
  // Configuration
  getGlobalConfig,
  Hotel,
  HowTo,
  HowToSection,
  HowToStep,
  ImageObject,
  ItemList,
  JobPosting,
  ListItem,
  LocalBusiness,
  LodgingBusiness,
  MobileApplication,
  Movie,
  NewsArticle,
  Offer,
  Organization,
  OrganizationSchema,
  Person,
  PostalAddress,
  Product,
  ProfilePage,
  parseDate,
  parseDurationToMs,
  QAPage,
  QAQuestion,
  Question,
  Rating,
  Recipe,
  Restaurant,
  Review,
  resetGlobalConfig,
  SCHEMA_ORG_BASELINE,
  // Types
  SchemaValidationError,
  Service,
  SoftwareApplication,
  Store,
  // Validation
  safeValidateSchema,
  serializeJsonLd,
  setGlobalConfig,
  VacationRental,
  VideoObject,
  validateSchema,
  WebApplication,
  WebPage,
  WebSite,
  withAdditionalProperties,
  withAdditionalTypes,
} from '@unschema-graph/core';

import {
  type AuditContentResult,
  type AuditDiagnostic,
  type AuditDiagnosticCode,
  type AuditError,
  type AuditResult,
  auditHtmlContent,
  auditHtmlDirectory,
  getHtmlFiles,
} from '@unschema-graph/core/audit';

// Smoke assertions to ensure symbols are strictly typed and available
const _org = Organization({ '@id': '#org', name: 'Acme' });
const _ref: EntityReference<typeof _org> = '#org';
const _customRefSchema = entityRef({ schemas: [OrganizationSchema] });
void _customRefSchema;

const _article = Article({
  headline: 'Public API Smoke',
  image: 'https://example.com/thumb.jpg',
  datePublished: '2026-10-02',
  author: 'Author',
});

const _graph = buildJsonLdGraph([_article]);
const _serialized = serializeJsonLd(_graph);
void _serialized;
void _ref;

// Audit API smoke check
const _auditRes: AuditContentResult = auditHtmlContent('<html></html>');
void _auditRes;
const _files = getHtmlFiles('.');
void _files;
const _dirRes = auditHtmlDirectory('.');
void _dirRes;
