// Hosting for Window Seat: one Azure Static Web App on the free tier.
// Deploy with: az deployment group create -g window-seat-rg -f infra/main.bicep

@description('Name of the static web app.')
param name string = 'window-seat'

@description('Region for the app\'s metadata. Static content is served globally.')
param location string = 'westus2'

resource site 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: {
    project: 'window-seat'
    environment: 'production'
    owner: 'jmalerba'
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {}
}

output hostname string = site.properties.defaultHostname
