// RESO Web API Data Dictionary - Skeleton
// https://www.reso.org/data-dictionary/
export interface ResoProperty {
  ListingId: string // maps to internal mls_number
  StandardStatus: 'Active' | 'Closed' | 'Expired' | 'Pending' | 'Withdrawn'
  PropertyType: 'Residential' | 'Residential Lease' | 'Commercial' | 'Land'
  ListPrice: number
  ListingContractDate?: string
  LivingArea: number
  BedroomsTotal: number
  BathroomsTotalInteger: number
  YearBuilt?: number
  PublicRemarks?: string
  ListAgentFullName?: string
  ListAgentEmail?: string
  ListAgentPreferredPhone?: string
  Media?: Array<{ MediaURL: string, ShortDescription?: string }>
}
