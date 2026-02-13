export interface ConstructionSiteInfo {
  officialName: string;
  aliases: string[];
  generalContractor: string;
  relatedCompanies: CompanyInfo[];
  address: string;
  usage: string;
  scale: string;
  constructionPeriod: string;
  notes: string;
  sources: SourceInfo[];
}

export interface CompanyInfo {
  name: string;
  role: string;
  details: string;
}

export interface SiteCompaniesResult {
  siteName: string;
  generalContractor: GeneralContractorInfo;
  companies: DetailedCompanyInfo[];
  sources: SourceInfo[];
}

export interface GeneralContractorInfo {
  name: string;
  details: string;
}

export interface DetailedCompanyInfo {
  name: string;
  role: string;
  details: string;
}

export interface SourceInfo {
  title: string;
  url: string;
}

export interface GeminiConfig {
  apiKeyConfigured: boolean;
  model: string;
}
