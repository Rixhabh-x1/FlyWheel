const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTokenBalance(wallet) {
  const response = await fetch(
    `${API_BASE_URL}/api/token/balance/${wallet}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch token balance");
  }

  return response.json();
}

export async function getOwnedNFTs(wallet) {
  const response = await fetch(
    `${API_BASE_URL}/api/nfts/${wallet}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch NFTs");
  }

  return response.json();
}

export async function getStakingData(wallet) {
  const response = await fetch(
    `${API_BASE_URL}/api/staking/${wallet}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch staking data");
  }

  return response.json();
}

export async function getMarketplaceListings() {
  const response = await fetch(
    `${API_BASE_URL}/api/marketplace/listings`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch marketplace listings");
  }

  return response.json();
}

export async function getStats() {
  const response = await fetch(
    `${API_BASE_URL}/api/stats`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
}

export async function getActivity(wallet) {
  const response = await fetch(
    `${API_BASE_URL}/api/activity/${wallet}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activity");
  }

  return response.json();
}