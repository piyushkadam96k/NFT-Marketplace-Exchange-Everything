// Index Page Logic
let filteredNftData = [];
let currentPage = 1;
const itemsPerPage = 20;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

async function initializeApp() {
    // Load from localStorage if available
    const savedData = localStorage.getItem('nftData');
    if (savedData) {
        mockNftData = JSON.parse(savedData);
    }

    // Use mockNftData from data.js
    filteredNftData = [...mockNftData];

    // Initialize components

    initializeCarousel();
    initializeEventListeners();
    initializeFilters();

    // Load initial NFT grid
    loadNftGrid();

    // Listen for wallet events
    window.addEventListener('walletConnected', () => {
        loadNftGrid(); // Reload grid to show ownership
    });
}

// Animate hero heading and CTAs on load
document.addEventListener('DOMContentLoaded', () => {
    try {
        const heroHeading = document.querySelector('.hero-content h1');
        const heroP = document.querySelector('.hero-content p');
        const heroCtas = document.querySelector('.hero-cta-wrap');
        if (heroHeading) anime({ targets: heroHeading, translateY: [-20, 0], opacity: [0, 1], duration: 800, easing: 'easeOutCubic' });
        if (heroP) anime({ targets: heroP, translateY: [-10, 0], opacity: [0, 1], duration: 800, delay: 150, easing: 'easeOutCubic' });
        if (heroCtas) anime({ targets: heroCtas, translateY: [-4, 0], opacity: [0, 1], duration: 800, delay: 250, easing: 'easeOutCubic' });
    } catch (e) { console.warn('Hero animation failed', e); }
});

// Initialize carousel
function initializeCarousel() {
    // Featured collections carousel
    if (document.getElementById('featured-carousel')) {
        new Splide('#featured-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '1rem',
            autoplay: true,
            interval: 4000,
            breakpoints: {
                768: { perPage: 2 },
                480: { perPage: 1 }
            }
        }).mount();
    }

    // New NFTs carousel
    if (document.getElementById('new-nfts-carousel')) {
        new Splide('#new-nfts-carousel', {
            type: 'loop',
            perPage: 4,
            perMove: 1,
            gap: '1rem',
            autoplay: true,
            interval: 3000,
            breakpoints: {
                1024: { perPage: 3 },
                768: { perPage: 2 },
                480: { perPage: 1 }
            }
        }).mount();
    }

    // Trending NFTs carousel
    if (document.getElementById('trending-nfts-carousel')) {
        new Splide('#trending-nfts-carousel', {
            type: 'loop',
            perPage: 4,
            perMove: 1,
            gap: '1rem',
            autoplay: true,
            interval: 3500,
            breakpoints: {
                1024: { perPage: 3 },
                768: { perPage: 2 },
                480: { perPage: 1 }
            }
        }).mount();
    }
}

// Event listeners
function initializeEventListeners() {
    // Wallet connection is handled in wallet.js

    // Filters
    document.querySelectorAll('.status-filter, .chain-filter, .category-filter').forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortNfts);
    }

    // Load more
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreNfts);
    }

    // Modal events
    const cancelPurchaseBtn = document.getElementById('cancelPurchase');
    if (cancelPurchaseBtn) {
        cancelPurchaseBtn.addEventListener('click', closePurchaseModal);
    }

    const confirmPurchaseBtn = document.getElementById('confirmPurchase');
    if (confirmPurchaseBtn) {
        confirmPurchaseBtn.addEventListener('click', confirmPurchase);
    }

    // Close modal on background click
    const purchaseModal = document.getElementById('purchaseModal');
    if (purchaseModal) {
        purchaseModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closePurchaseModal();
            }
        });
    }

    // Create NFT button
    const createNftBtn = document.getElementById('createNftBtn');
    if (createNftBtn) {
        console.log('Create NFT button found, attaching listener');
        createNftBtn.addEventListener('click', () => {
            console.log('Create NFT button clicked');
            showCreateNftModal();
        });
    } else {
        console.error('Create NFT button NOT found');
    }

    // Explore NFTs hero button - scroll to NFT grid
    const exploreBtn = document.querySelector('.hero-cta .btn-primary');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const grid = document.getElementById('nftGrid');
            if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Filter Sidebar Toggle (Mobile)
    const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    if (toggleFiltersBtn && filterSidebar) {
        toggleFiltersBtn.addEventListener('click', () => {
            filterSidebar.classList.toggle('hidden');
            toggleFiltersBtn.textContent = filterSidebar.classList.contains('hidden') ? 'Show Filters' : 'Hide Filters';
        });
    }

    // Connect Wallet Mobile
    const connectWalletMobile = document.getElementById('connectWalletMobile');
    if (connectWalletMobile) {
        connectWalletMobile.addEventListener('click', connectWallet);
    }

}

// Filter functionality
function initializeFilters() {
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function () {
            applyFilters();
        });
    }
}

function applyFilters() {
    let filtered = [...mockNftData];

    // Status filter
    const statusFilters = Array.from(document.querySelectorAll('.status-filter:checked'))
        .map(cb => cb.value);
    if (statusFilters.length > 0) {
        filtered = filtered.filter(nft => statusFilters.includes(nft.status));
    }

    // Chain filter
    const chainFilters = Array.from(document.querySelectorAll('.chain-filter:checked'))
        .map(cb => cb.value);
    if (chainFilters.length > 0) {
        filtered = filtered.filter(nft => chainFilters.includes(nft.chain));
    }

    // Category filter
    const categoryFilters = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(cb => cb.value);
    if (categoryFilters.length > 0) {
        filtered = filtered.filter(nft => categoryFilters.includes(nft.category));
    }

    // Price filter (simplified)
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        const maxPrice = parseFloat(priceRange.value);
        filtered = filtered.filter(nft => parseFloat(nft.price) <= maxPrice);
    }

    filteredNftData = filtered;
    currentPage = 1;
    loadNftGrid();
}

function sortNfts() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;

    const sortValue = sortSelect.value;

    switch (sortValue) {
        case 'recent':
            filteredNftData.sort((a, b) => b.id - a.id);
            break;
        case 'popular':
            filteredNftData.sort((a, b) => b.views - a.views);
            break;
        case 'price-low':
            filteredNftData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            filteredNftData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'trending':
            filteredNftData.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
            break;
    }

    currentPage = 1;
    loadNftGrid();
}

// NFT Grid functionality
function loadNftGrid() {
    const grid = document.getElementById('nftGrid');
    if (!grid) return;

    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const nftsToShow = filteredNftData.slice(startIndex, endIndex);

    grid.innerHTML = '';

    nftsToShow.forEach((nft, index) => {
        const nftCard = createNftCard(nft);
        grid.appendChild(nftCard);

        // Animate card entrance
        anime({
            targets: nftCard,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: index * 50,
            duration: 600,
            easing: 'easeOutQuart'
        });
    });

    // Update load more button
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        if (endIndex >= filteredNftData.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

function loadMoreNfts() {
    currentPage++;
    loadNftGrid();
}

function createNftCard(nft) {
    const card = document.createElement('div');
    card.className = 'nft-card rounded-xl overflow-hidden cursor-pointer flex flex-col h-full';

    // Navigate to details page on click
    card.onclick = () => {
        window.location.href = `nft-details.html?id=${nft.id}`;
    };

    const priceChange = Math.random() > 0.5 ?
        `<span class="text-green-400 text-sm">+${(Math.random() * 10).toFixed(1)}%</span>` :
        `<span class="text-red-400 text-sm">-${(Math.random() * 5).toFixed(1)}%</span>`;

    const isOwnedByUser = currentAccount && nft.owner && nft.owner === currentAccount;
    const isCreatedByUser = currentAccount && (nft.creator === currentAccount || nft.isNew);
    const isForSale = !!nft.price && ['buy-now', 'new', 'offers'].includes(nft.status);

    card.innerHTML = `
        <div class="relative">
            <img src="${nft.image}" alt="${nft.name}" class="w-full h-48 object-cover">
            <div class="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-xs">
                <span class="mr-1">❤️</span>${nft.likes}
            </div>
            ${nft.isNew ? '<div class="absolute top-2 left-2 bg-green-500 rounded-full px-2 py-1 text-xs text-white">NEW</div>' : ''}
            ${nft.isTrending ? '<div class="absolute bottom-2 left-2 bg-orange-500 rounded-full px-2 py-1 text-xs text-white">🔥 TRENDING</div>' : ''}
        </div>
        <div class="p-4 flex flex-col flex-1">
            <h3 class="font-semibold text-lg mb-1">${nft.name}</h3>
            <p class="text-gray-400 text-sm mb-2">${nft.collection}</p>
            <div class="flex flex-wrap gap-1 mb-3">
                ${nft.attributes.slice(0, 2).map(attr =>
        `<span class="bg-white bg-opacity-10 rounded px-2 py-1 text-xs">${attr}</span>`
    ).join('')}
            </div>
            <div class="flex justify-between items-center mb-3">
                <span class="text-blue-400 font-semibold mono">${nft.price} ${nft.currency}</span>
                ${priceChange}
            </div>

            <div class="flex justify-between items-center text-xs text-gray-400 mb-2">
                <span class="capitalize">${nft.chain}</span>
                <span>${nft.views} views</span>
            </div>
            
            <div class="mt-auto pt-2 space-y-2">
                ${isOwnedByUser ? '<div class="text-xs text-green-400">✓ You own this NFT</div>' : ''}

                <div class="flex gap-2">
                    ${isOwnedByUser ? `<button class="sell-nft-btn flex-1 btn-secondary py-1 rounded text-sm" data-nft-id="${nft.id}" onclick="event.stopPropagation(); showSellNftModal(${nft.id})">Sell</button>` : ''}
                    ${isOwnedByUser ? `<button class="quick-sell-btn flex-1 bg-green-500 bg-opacity-20 text-green-400 hover:bg-opacity-30 py-1 rounded text-sm transition-all" onclick="event.stopPropagation(); quickSellNft(${nft.id})">Quick Sell</button>` : ''}
                    ${!isOwnedByUser && isForSale ? `<button class="buy-now-btn flex-1 btn-primary py-2 rounded text-sm">Buy Now</button>` : ''}
                    ${!isOwnedByUser && nft.status === 'auction' ? `<button class="btn-secondary flex-1 py-2 rounded text-sm view-auction">Place Bid</button>` : ''}
                    ${!isOwnedByUser && nft.status === 'offers' ? `<button class="btn-secondary flex-1 py-2 rounded text-sm view-offers">View Offers</button>` : ''}
                    ${isCreatedByUser && !isOwnedByUser ? `<button class="delete-nft-btn flex-1 bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 py-1 rounded text-sm transition-all" onclick="event.stopPropagation(); deleteNft(${nft.id})">Delete</button>` : ''}
                </div>
            </div>
        </div>
    `;

    // Attach buy event listener if buy button exists
    const buyBtn = card.querySelector('.buy-now-btn');
    if (buyBtn) {
        buyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openPurchaseModal(nft);
        });
    }
    // Attach auction and offers handlers
    const viewAuctionBtn = card.querySelector('.view-auction');
    if (viewAuctionBtn) {
        viewAuctionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = `nft-details.html?id=${nft.id}`;
        });
    }
    const viewOffersBtn = card.querySelector('.view-offers');
    if (viewOffersBtn) {
        viewOffersBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = `nft-details.html?id=${nft.id}`;
        });
    }

    return card;
}

function deleteNft(nftId) {
    if (!confirm('Are you sure you want to delete this NFT? This action cannot be undone.')) {
        return;
    }

    // Remove from data
    mockNftData = mockNftData.filter(n => n.id !== nftId);

    // Update localStorage
    localStorage.setItem('nftData', JSON.stringify(mockNftData));

    // Refresh grid
    applyFilters(); // This will re-render the grid

    alert('NFT deleted successfully.');
}

// Purchase Modal
function openPurchaseModal(nft) {
    if (!currentAccount) {
        alert('Please connect your wallet first.');
        return;
    }

    const modal = document.getElementById('purchaseModal');
    const modalNftImage = document.getElementById('modalNftImage');
    const modalNftName = document.getElementById('modalNftName');
    const modalNftCollection = document.getElementById('modalNftCollection');
    const modalNftPrice = document.getElementById('modalNftPrice');
    const modalTotalPrice = document.getElementById('modalTotalPrice');
    const modalNftDescription = document.getElementById('modalNftDescription');

    // Populate modal with NFT data
    modalNftImage.innerHTML = `<img src="${nft.image}" alt="${nft.name}" class="w-full h-full object-cover">`;
    modalNftName.textContent = nft.name;
    modalNftCollection.textContent = nft.collection;
    modalNftPrice.textContent = `${nft.price} ${nft.currency} `;
    modalNftDescription.textContent = nft.description || 'No description available.';

    // Calculate total with service fee
    const price = parseFloat(nft.price);
    const serviceFee = price * 0.025;
    const total = price + serviceFee;
    modalTotalPrice.textContent = `${total.toFixed(4)} ${nft.currency} `;

    // Store current NFT for purchase
    modal.dataset.nftId = nft.id;

    // Show modal
    modal.classList.remove('hidden');

    // Animate modal entrance
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
}

function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    if (!modal) return;

    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuart',
        complete: () => {
            modal.classList.add('hidden');
        }
    });
}

async function confirmPurchase() {
    const modal = document.getElementById('purchaseModal');
    const nftId = parseInt(modal.dataset.nftId);
    const nft = mockNftData.find(n => n.id === nftId);

    if (!nft) {
        alert('NFT not found.');
        return;
    }

    // Check if user already owns this NFT
    if (nft.owner === currentAccount) {
        alert('You already own this NFT!');
        return;
    }

    // Check balance
    const currentBalance = window.getFakeBalance();
    const price = parseFloat(nft.price);
    const serviceFee = price * 0.025;
    const total = price + serviceFee;

    if (currentBalance < total) {
        alert(`Insufficient funds! You need ${total.toFixed(4)} ETH but only have ${currentBalance.toFixed(4)} ETH.`);
        return;
    }

    try {
        // UI Elements for progress
        const confirmBtn = document.getElementById('confirmPurchase');
        const originalText = confirmBtn.textContent;
        const txProgress = document.getElementById('txProgress');
        const txStatus = document.getElementById('txStatus');
        const txBar = document.getElementById('txProgressBar');
        const txHashEl = document.getElementById('txHash');

        // Prepare UI
        confirmBtn.textContent = 'Processing...';
        confirmBtn.disabled = true;
        txProgress.classList.remove('hidden');
        txStatus.textContent = 'Awaiting confirmation...';
        txBar.style.width = '10%';
        txHashEl.textContent = '';

        // Simulate progressive states
        const updateProgress = (value, status) => {
            txBar.style.width = `${value}%`;
            txStatus.textContent = status;
        };

        await new Promise(resolve => setTimeout(resolve, 800));
        updateProgress(30, 'Confirming on chain...');

        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress(60, 'Finalizing transaction...');

        // Call centralized Market simulation
        const result = await Market.simulatePurchaseByMockId(nft.id, currentAccount || 'You');

        if (!result.success) {
            alert(result.message || 'Purchase failed');
            txProgress.classList.add('hidden');
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            return;
        }

        updateProgress(100, 'Completed');
        txHashEl.textContent = `Transaction: ${result.txHash}`;

        // Close modal and refresh grid
        setTimeout(() => {
            closePurchaseModal();
            loadNftGrid();
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            txProgress.classList.add('hidden');
            // Show success alert
            alert(`Purchase successful! You now own ${nft.name}.\n\nTransaction Hash: ${result.txHash}`);
        }, 800);

    } catch (error) {
        console.error('Transaction failed:', error);
        alert('Transaction failed. Please try again.');
        const confirmBtn = document.getElementById('confirmPurchase');
        confirmBtn.textContent = 'Confirm Purchase';
        confirmBtn.disabled = false;
    }
}

// Sell NFT Modal
function showSellNftModal(nftId) {
    if (!currentAccount) {
        alert('Please connect your wallet first.');
        return;
    }

    const nft = mockNftData.find(n => n.id === nftId);
    if (!nft) {
        alert('NFT not found.');
        return;
    }

    // Check if user owns this NFT
    /* 
    if (nft.owner !== currentAccount) {
        alert('You do not own this NFT!');
        return;
    }
    */
    // Create sell modal
    const modal = document.createElement('div');
    modal.className = 'modal fixed inset-0 z-50';
    modal.innerHTML = `
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="modal-content rounded-xl p-6 max-w-md w-full">
                <div class="text-center">
                    <h3 class="text-2xl font-bold mb-4">List NFT for Sale</h3>
                    <div class="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden">
                        <img src="${nft.image}" alt="${nft.name}" class="w-full h-full object-cover">
                    </div>
                    <h4 class="text-xl font-semibold mb-2">${nft.name}</h4>
                    <p class="text-gray-400 mb-4">${nft.collection}</p>
                    
                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium mb-2">Sale Price (ETH)</label>
                            <input type="number" id="sellPrice" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white" placeholder="Enter price" step="0.01" min="0">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Sale Type</label>
                            <select id="saleType" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white">
                                <option value="buy-now">Buy Now</option>
                                <option value="auction">Auction</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex space-x-4">
                        <button onclick="closeSellModal()" class="btn-secondary flex-1 py-3 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button onclick="confirmSell(${nftId})" class="btn-primary flex-1 py-3 rounded-lg font-medium">
                            List for Sale
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Animate modal entrance
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
}

function closeSellModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        anime({
            targets: modal.querySelector('.modal-content'),
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuart',
            complete: () => {
                document.body.removeChild(modal);
            }
        });
    }
}

function confirmSell(nftId) {
    const sellPrice = document.getElementById('sellPrice').value;
    const saleType = document.getElementById('saleType').value;

    if (!sellPrice || parseFloat(sellPrice) <= 0) {
        alert('Please enter a valid price.');
        return;
    }

    const nft = mockNftData.find(n => n.id === nftId);
    if (!nft) {
        alert('NFT not found.');
        return;
    }

    // Simulate listing the NFT using Market
    (async () => {
        const result = await Market.simulateListByMockId(nftId, sellPrice);
        if (!result.success) {
            alert(result.message || 'Failed to list NFT');
            return;
        }
        alert(`${nft.name} has been listed for sale at ${sellPrice} ETH!`);
        closeSellModal();
        loadNftGrid();
    })();
}

function quickSellNft(nftId) {
    const nft = mockNftData.find(n => n.id === nftId);
    if (!nft) return;
    const sellPrice = parseFloat(nft.price) * 0.9;
    if (!confirm(`Are you sure you want to quick sell ${nft.name} for ${sellPrice.toFixed(4)} ETH? This action is instant.`)) return;

    (async () => {
        const result = await Market.simulateQuickSellByMockId(nftId);
        if (!result.success) {
            alert(result.message || 'Quick sell failed');
            return;
        }
        alert(`Sold ${nft.name} for ${sellPrice.toFixed(4)} ETH!`);
        loadNftGrid();
    })();
}



// Create NFT Modal
function showCreateNftModal() {
    if (!currentAccount) {
        alert('Please connect your wallet first to create NFTs.');
        return;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'createNftModal';
    modal.className = 'modal fixed inset-0 z-50 overflow-y-auto';
    modal.innerHTML = `
        <div class="flex items-center justify-center min-h-screen px-4 py-8">
            <div class="modal-content rounded-xl p-6 max-w-md w-full my-auto relative">
                <button onclick="closeCreateModal()" class="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="text-center">
                    <h3 class="text-2xl font-bold mb-4">Create New NFT</h3>

                    <div class="space-y-3 mb-6 text-left">
                        <div>
                            <label class="block text-sm font-medium mb-1">NFT Image</label>
                            <div class="border-2 border-dashed border-white border-opacity-20 rounded-lg p-3 text-center">
                                <input type="file" id="nftImage" accept="image/*" class="hidden">
                                    <div id="imagePreview" class="mb-2 hidden">
                                        <img id="previewImg" class="w-16 h-16 object-cover rounded-lg mx-auto">
                                    </div>
                                    <button type="button" onclick="document.getElementById('nftImage').click()" class="btn-secondary px-3 py-1 rounded text-xs">
                                        Choose Image
                                    </button>
                                    <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">NFT Name</label>
                            <input type="text" id="nftName" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white text-sm" placeholder="Enter NFT name">
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Collection</label>
                            <input type="text" id="nftCollection" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white text-sm" placeholder="Enter collection name">
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Price (ETH)</label>
                            <input type="number" id="nftPrice" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white text-sm" placeholder="Enter price" step="0.01" min="0">
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Description</label>
                            <textarea id="nftDescription" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white text-sm" placeholder="Enter description" rows="2"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1">Category</label>
                            <select id="nftCategory" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white text-sm">
                                <option value="art" class="text-black">Art</option>
                                <option value="gaming" class="text-black">Gaming</option>
                                <option value="music" class="text-black">Music</option>
                                <option value="domains" class="text-black">Domain Names</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex space-x-4 sticky bottom-0 bg-[#1a1a1a] pt-2">
                        <button type="button" onclick="closeCreateModal()" class="btn-secondary flex-1 py-3 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button type="button" onclick="confirmCreateNft()" class="btn-primary flex-1 py-3 rounded-lg font-medium">
                            Create NFT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Animate modal entrance
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });

    // Add image upload handler
    const imageInput = modal.querySelector('#nftImage');
    const imagePreview = modal.querySelector('#imagePreview');
    const previewImg = modal.querySelector('#previewImg');

    imageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log('File read successfully');
                previewImg.src = e.target.result;
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });
}

function closeCreateModal() {
    const modal = document.getElementById('createNftModal');
    if (modal) {
        anime({
            targets: modal.querySelector('.modal-content'),
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuart',
            complete: () => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }
        });
    }
}

function confirmCreateNft() {
    const name = document.getElementById('nftName').value;
    const collection = document.getElementById('nftCollection').value;
    const price = document.getElementById('nftPrice').value;
    const description = document.getElementById('nftDescription').value;
    const category = document.getElementById('nftCategory').value;
    const previewImg = document.getElementById('previewImg');
    const imagePreview = document.getElementById('imagePreview');

    if (!name || !collection || !price || !description) {
        alert('Please fill in all fields.');
        return;
    }

    // Check if image is uploaded (preview is visible and has src)
    if (imagePreview.classList.contains('hidden') || !previewImg.src) {
        alert('Please select an image.');
        return;
    }

    // Generate new ID
    const newId = Math.max(...mockNftData.map(n => n.id)) + 1;

    // Create new NFT object
    const newNft = {
        id: newId,
        name: name,
        collection: collection,
        image: previewImg.src, // Use the data URL from preview
        price: price,
        currency: "ETH",
        owner: currentAccount,
        creator: currentAccount,
        attributes: ["New", "User Created", category],
        chain: "ethereum",
        category: category,
        status: "buy-now", // Default to buy-now so others can buy it (if we switch accounts)
        likes: 0,
        views: 0,
        isNew: true,
        isTrending: false,
    }

    // Add to data source
    mockNftData.unshift(newNft);

    // Save to localStorage
    localStorage.setItem('nftData', JSON.stringify(mockNftData));

    // Reset all filters to ensure the new NFT is visible
    document.querySelectorAll('.status-filter, .chain-filter, .category-filter').forEach(cb => cb.checked = false);
    const priceRange = document.getElementById('priceRange');
    if (priceRange) priceRange.value = priceRange.max; // Reset to max price

    // Reset sort to recent (newest first)
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'recent';

    // Refresh grid
    applyFilters();

    // Sort again to ensure 'recent' order is applied if applyFilters didn't do it (applyFilters usually just filters)
    sortNfts();

    alert('NFT Created Successfully! It has been added to the marketplace.');
    closeCreateModal();

    // Scroll to grid so user sees their new NFT
    const grid = document.getElementById('nftGrid');
    if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });


    }
}
