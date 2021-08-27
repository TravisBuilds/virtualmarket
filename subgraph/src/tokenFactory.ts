import { Create, TokenFactory } from '../generated/TokenFactory/TokenFactory'
import { ProductTokenTemplate } from '../generated/templates'

export function handleNewProductToken(event: Create): void {
  let tokenFactory = TokenFactory.bind(event.address)
  let productName = event.params.name
  let productTokenAddress = tokenFactory.retrieveToken(productName)
  ProductTokenTemplate.create(productTokenAddress)
}
