import { Address, BigInt } from '@graphprotocol/graph-ts'
import { ProductToken as ProductTokenContract, Tradein, Transfer, Update } from '../generated/templates/ProductTokenTemplate/ProductToken'
import { ProductToken, TokenBalance, User } from '../generated/schema'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

function updateBalance(userAddress: Address, productTokenAddress: Address, timestamp: BigInt): void {
  let userId = userAddress.toHex()
  if (userId != ADDRESS_ZERO) {
    let user = new User(userId)
    let productTokenContract = ProductTokenContract.bind(productTokenAddress)
    let productTokenId = productTokenAddress.toHex()
    let tokenBalanceId = userId + '-' + productTokenId
    let tokenBalance = TokenBalance.load(tokenBalanceId)
    if (tokenBalance == null) {
      tokenBalance = new TokenBalance(tokenBalanceId)
      tokenBalance.tradeinCount = BigInt.fromI32(0)
      tokenBalance.user = userId
      tokenBalance.productToken = productTokenId
    }
    tokenBalance.balance = productTokenContract.balanceOf(userAddress)
    tokenBalance.lastUpdate = timestamp
    user.save()
    tokenBalance.save()
  }
}

function updateProductTokenInfo(productTokenAddress: Address, timestamp: BigInt): void {
  let productToken = ProductToken.load(productTokenAddress.toHex())
  let productTokenContract = ProductTokenContract.bind(productTokenAddress)
  if (productToken == null) {
    productToken = new ProductToken(productTokenAddress.toHex())
    productToken.productName = productTokenContract.name()
    productToken.maxTokenCount = productTokenContract.maxTokenCount()
  }
  productToken.tradeinCount = productTokenContract.tradeinCount()
  productToken.availability = productTokenContract.getAvailability()
  productToken.daiPrice = productTokenContract.getCurrentPrice()
  productToken.lastUpdate = timestamp
  productToken.save()
}

export function handleTransfer(event: Transfer): void {
  let from = event.params.from
  let to = event.params.to
  let productTokenAddress = event.address
  let timestamp = event.block.timestamp
  updateProductTokenInfo(productTokenAddress, timestamp)
  updateBalance(from, productTokenAddress, timestamp)
  updateBalance(to, productTokenAddress, timestamp)
}

export function handleUpdate(event: Update): void {
  updateProductTokenInfo(event.address, event.block.timestamp)
}

export function handleTradein(event: Tradein): void {
  updateProductTokenInfo(event.address, event.block.timestamp)

  let sender = event.params.sender
  let amount = event.params.amount

  // to trade in, the user must have had made a tx involving a Transfer event prior,
  // so the associated User and TokenBalance entities must exist
  let userId = sender.toHex()
  let productTokenId = event.address.toHex()
  let tokenBalanceId = userId + '-' + productTokenId
  let tokenBalance = TokenBalance.load(tokenBalanceId)
  tokenBalance.tradeinCount = tokenBalance.tradeinCount.plus(amount)
  tokenBalance.save()
}
