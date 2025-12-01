

document.addEventListener('DOMContentLoaded', function () {
    initializeProfilePage();
});

function initializeProfilePage() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });

    // Load initial data
    loadProfileData();

    // Listen for wallet changes
    window.addEventListener('walletConnected', () => {
        loadProfileData();
    });

    // Update when a purchase completes
    window.addEventListener('nftPurchased', () => {
        loadProfileData();
    });
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');

        // Animate tab content
        anime({
            targets: `#${tabName}`,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 400,
            easing: 'easeOutQuart'
        });
    }

    // Add active class to clicked tab button
    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

function loadProfileData() {
    // For demo, if no wallet connected, show some default "demo user" data
    // If wallet connected, filter by that wallet

    const accountToShow = currentAccount || "0x742d35Cc6634C0532925a3b8D4C0C8b3C"; // Default demo user

    // Update Header
    const addressEl = document.querySelector('.profile-header p.mono');
    if (addressEl) addressEl.textContent = accountToShow;

    // Filter Data
    const collected = mockNftData.filter(n => n.owner === accountToShow);
    const created = mockNftData.filter(n => n.creator === accountToShow);
    const favorited = mockNftData.filter(n => n.likes > 500); // Mock logic for favorites

    // Update Stats
    document.querySelector('.stat-card:nth-child(1) .text-2xl').textContent = collected.length;
    document.querySelector('.stat-card:nth-child(2) .text-2xl').textContent = created.length;
    document.querySelector('.stat-card:nth-child(3) .text-2xl').textContent = favorited.length;

    // Render Grids
    renderNftGrid('collected', collected);
    renderNftGrid('created', created);
    renderNftGrid('favorited', favorited);
}

function renderNftGrid(tabId, nfts) {
    const container = document.querySelector(`#${tabId} .grid`);
    if (!container) return;

    container.innerHTML = '';

    if (nfts.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center text-gray-400 py-10">No NFTs found</div>';
        return;
    }

    nfts.forEach(nft => {
        const card = document.createElement('div');
        card.className = 'nft-card rounded-xl overflow-hidden cursor-pointer';
        card.onclick = () => window.location.href = `nft-details.html?id=${nft.id}`;

        card.innerHTML = `
            <img src="${nft.image}" alt="${nft.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-semibold mb-1">${nft.name}</h3>
                <p class="text-gray-400 text-sm mb-2">${nft.collection}</p>
                <div class="flex justify-between items-center">
                    <span class="text-blue-400 font-semibold mono">${nft.price} ${nft.currency}</span>
                    <span class="text-gray-400 text-sm">❤️ ${nft.likes}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
