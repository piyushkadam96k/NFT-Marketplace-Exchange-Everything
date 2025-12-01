

// Global variables
let currentAccount = null;
let nftData = [];
let filteredNftData = [];
let currentPage = 1;
let userNfts = []; // NFTs owned by current user
let userListings = []; // NFTs listed for sale by user
const itemsPerPage = 20;


const mockNftData = [
    {
        id: 1,
        name: "CryptoPunk #7804",
        collection: "CryptoPunks",
        image: "./resources/nft-1.jpg",
        price: "24.5",
        currency: "ETH",
        owner: "0x742d35Cc6634C0532925a3b8D4C0C8b3C",
        creator: "0x742d35Cc6634C0532925a3b8D4C0C8b3C",
        attributes: ["Alien", "Pipe", "Cap"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 1247,
        views: 8932,
        isNew: false,
        isTrending: true,
        description: "One of the rarest CryptoPunks with alien skin and unique accessories."
    },
    {
        id: 2,
        name: "Azuki #4521",
        collection: "Azuki",
        image: "./resources/nft-2.jpg",
        price: "8.2",
        currency: "ETH",
        owner: "0x8ba1f109551bD432803012645Hac136c",
        creator: "0x8ba1f109551bD432803012645Hac136c",
        attributes: ["Red Kimono", "Sword", "Spirit"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 892,
        views: 5421,
        isNew: false,
        isTrending: true,
        description: "A mystical Azuki warrior with powerful spiritual energy."
    },
    {
        id: 3,
        name: "Polygon Master #89",
        collection: "Polygon Masters",
        image: "./resources/nft-3.jpg",
        price: "2.1",
        currency: "ETH",
        owner: "0x3f5E5B8d3B2A1C9E8F7D6C5B4A3",
        creator: "0x3f5E5B8d3B2A1C9E8F7D6C5B4A3",
        attributes: ["Blue", "Geometric", "Abstract"],
        chain: "polygon",
        category: "art",
        status: "auction",
        likes: 456,
        views: 2341,
        isNew: true,
        isTrending: false,
        description: "Geometric abstraction representing the future of blockchain art."
    },
    {
        id: 4,
        name: "Digital Dream #156",
        collection: "Digital Dreams",
        image: "./resources/nft-4.jpg",
        price: "1.8",
        currency: "ETH",
        owner: "0x9c2f3E8d1B4A5C7D9E6F3A2B1",
        creator: "0x9c2f3E8d1B4A5C7D9E6F3A2B1",
        attributes: ["Abstract", "Colorful", "Dynamic"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 234,
        views: 1876,
        isNew: true,
        isTrending: false,
        description: "A vibrant digital dreamscape with flowing colors and shapes."
    },
    {
        id: 5,
        name: "Solana Warrior #23",
        collection: "Solana Warriors",
        image: "./resources/nft-5.jpg",
        price: "15.7",
        currency: "SOL",
        owner: "0x7a8B9c3D2E1F4G6H5J4K3L2M1",
        creator: "0x7a8B9c3D2E1F4G6H5J4K3L2M1",
        attributes: ["Warrior", "Armor", "Sword"],
        chain: "solana",
        category: "gaming",
        status: "buy-now",
        likes: 678,
        views: 3456,
        isNew: false,
        isTrending: true,
        description: "A fierce warrior from the Solana blockchain realm."
    },
    {
        id: 6,
        name: "Blockchain Art #77",
        collection: "Blockchain Arts",
        image: "./resources/nft-6.jpg",
        price: "3.4",
        currency: "ETH",
        owner: "0x4e5F6G7H8I9J0K1L2M3N4O5P6",
        creator: "0x4e5F6G7H8I9J0K1L2M3N4O5P6",
        attributes: ["Modern", "Conceptual", "Digital"],
        chain: "ethereum",
        category: "art",
        status: "new",
        likes: 345,
        views: 2123,
        isNew: true,
        isTrending: false,
        description: "Modern conceptual art piece exploring digital ownership."
    },
    {
        id: 7,
        name: "Moonbird #892",
        collection: "Moonbirds",
        image: "./resources/nft-7.jpg",
        price: "12.3",
        currency: "ETH",
        owner: "0x5g6H7I8J9K0L1M2N3O4P5Q6R7",
        creator: "0x5g6H7I8J9K0L1M2N3O4P5Q6R7",
        attributes: ["Ruby", "Cosmic", "Mystical"],
        chain: "ethereum",
        category: "art",
        status: "offers",
        likes: 567,
        views: 2987,
        isNew: false,
        isTrending: true,
        description: "A mystical moonbird with cosmic ruby feathers."
    },
    {
        id: 8,
        name: "Polygon Genesis #45",
        collection: "Polygon Genesis",
        image: "./resources/nft-8.jpg",
        price: "4.7",
        currency: "ETH",
        owner: "0x6h7I8J9K0L1M2N3O4P5Q6R7S8",
        creator: "0x6h7I8J9K0L1M2N3O4P5Q6R7S8",
        attributes: ["Genesis", "Rare", "Animated"],
        chain: "polygon",
        category: "art",
        status: "buy-now",
        likes: 289,
        views: 1654,
        isNew: true,
        isTrending: false,
        description: "Genesis piece from the Polygon blockchain collection."
    },
    {
        id: 9,
        name: "Azuki Spirit #234",
        collection: "Azuki Spirits",
        image: "./resources/nft-9.jpg",
        price: "6.8",
        currency: "ETH",
        owner: "0x7i8J9K0L1M2N3O4P5Q6R7S8T9",
        creator: "0x7i8J9K0L1M2N3O4P5Q6R7S8T9",
        attributes: ["Spirit", "Ethereal", "Blue"],
        chain: "ethereum",
        category: "art",
        status: "auction",
        likes: 445,
        views: 2876,
        isNew: false,
        isTrending: false,
        description: "An ethereal spirit from the Azuki universe."
    },
    {
        id: 10,
        name: "Ethereum Classic #11",
        collection: "Ethereum Classics",
        image: "./resources/nft-10.jpg",
        price: "7.9",
        currency: "ETH",
        owner: "0x8j9K0L1M2N3O4P5Q6R7S8T9U0",
        creator: "0x8j9K0L1M2N3O4P5Q6R7S8T9U0",
        attributes: ["Classic", "Vintage", "Historic"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 334,
        views: 1987,
        isNew: false,
        isTrending: false,
        description: "A classic piece representing the history of Ethereum."
    },
    {
        id: 11,
        name: "Crypto Punkette #156",
        collection: "Crypto Punkettes",
        image: "./resources/nft-11.jpg",
        price: "18.9",
        currency: "ETH",
        owner: "0x9k0L1M2N3O4P5Q6R7S8T9U0V1",
        creator: "0x9k0L1M2N3O4P5Q6R7S8T9U0V1",
        attributes: ["Female", "Earrings", "Red Lipstick"],
        chain: "ethereum",
        category: "art",
        status: "offers",
        likes: 756,
        views: 4234,
        isNew: false,
        isTrending: true,
        description: "A rare female CryptoPunk with distinctive accessories."
    },
    {
        id: 12,
        name: "Pixel Master #78",
        collection: "Pixel Masters",
        image: "./resources/nft-12.jpg",
        price: "2.3",
        currency: "ETH",
        owner: "0x0l1M2N3O4P5Q6R7S8T9U0V1W2",
        creator: "0x0l1M2N3O4P5Q6R7S8T9U0V1W2",
        attributes: ["Pixel", "8-bit", "Retro"],
        chain: "ethereum",
        category: "art",
        status: "new",
        likes: 198,
        views: 1234,
        isNew: true,
        isTrending: false,
        description: "8-bit retro pixel art masterpiece."
    },
    {
        id: 13,
        name: "Digital Artist #42",
        collection: "Digital Artists",
        image: "./resources/nft-13.jpg",
        price: "5.6",
        currency: "ETH",
        owner: "0x1m2N3O4P5Q6R7S8T9U0V1W2X3",
        creator: "0x1m2N3O4P5Q6R7S8T9U0V1W2X3",
        attributes: ["Artist", "Creative", "Modern"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 412,
        views: 2567,
        isNew: false,
        isTrending: false,
        description: "Modern digital art representing creative expression."
    },
    {
        id: 14,
        name: "Future Vision #99",
        collection: "Future Visions",
        image: "./resources/nft-14.jpg",
        price: "9.1",
        currency: "ETH",
        owner: "0x2n3O4P5Q6R7S8T9U0V1W2X3Y4",
        creator: "0x2n3O4P5Q6R7S8T9U0V1W2X3Y4",
        attributes: ["Future", "Vision", "Sci-fi"],
        chain: "ethereum",
        category: "art",
        status: "auction",
        likes: 567,
        views: 3456,
        isNew: false,
        isTrending: false,
        description: "A sci-fi vision of the future in digital form."
    },
    {
        id: 15,
        name: "NFT Trading Card #33",
        collection: "NFT Trading Cards",
        image: "./resources/nft-15.jpg",
        price: "1.2",
        currency: "ETH",
        owner: "0x3o4P5Q6R7S8T9U0V1W2X3Y4Z5",
        creator: "0x3o4P5Q6R7S8T9U0V1W2X3Y4Z5",
        attributes: ["Trading", "Card", "Collectible"],
        chain: "ethereum",
        category: "gaming",
        status: "buy-now",
        likes: 234,
        views: 1678,
        isNew: true,
        isTrending: false,
        description: "Rare trading card from the NFT gaming universe."
    },
    {
        id: 16,
        name: "Azuki Warrior #167",
        collection: "Azuki Warriors",
        image: "./resources/nft-16.jpg",
        price: "11.4",
        currency: "ETH",
        owner: "0x4p5Q6R7S8T9U0V1W2X3Y4Z5A6",
        creator: "0x4p5Q6R7S8T9U0V1W2X3Y4Z5A6",
        attributes: ["Warrior", "Katana", "Armor"],
        chain: "ethereum",
        category: "art",
        status: "offers",
        likes: 489,
        views: 2765,
        isNew: false,
        isTrending: false,
        description: "A skilled warrior from the Azuki collection."
    },
    {
        id: 17,
        name: "Digital Landscape #58",
        collection: "Digital Landscapes",
        image: "./resources/nft-17.jpg",
        price: "3.7",
        currency: "ETH",
        owner: "0x5q6R7S8T9U0V1W2X3Y4Z5A6B7",
        creator: "0x5q6R7S8T9U0V1W2X3Y4Z5A6B7",
        attributes: ["Landscape", "Nature", "Digital"],
        chain: "ethereum",
        category: "art",
        status: "new",
        likes: 356,
        views: 2134,
        isNew: true,
        isTrending: false,
        description: "Beautiful digital landscape capturing nature's essence."
    },
    {
        id: 18,
        name: "Moonbird Mystic #445",
        collection: "Moonbird Mystics",
        image: "./resources/nft-18.jpg",
        price: "16.8",
        currency: "ETH",
        owner: "0x6r7S8T9U0V1W2X3Y4Z5A6B7C8",
        creator: "0x6r7S8T9U0V1W2X3Y4Z5A6B7C8",
        attributes: ["Mystic", "Magical", "Enchanted"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 623,
        views: 3678,
        isNew: false,
        isTrending: true,
        description: "A mystical moonbird with magical enchanted powers."
    },
    {
        id: 19,
        name: "Crypto Artist #89",
        collection: "Crypto Artists",
        image: "./resources/nft-19.jpg",
        price: "4.2",
        currency: "ETH",
        owner: "0x7s8T9U0V1W2X3Y4Z5A6B7C8D9",
        creator: "0x7s8T9U0V1W2X3Y4Z5A6B7C8D9",
        attributes: ["Artist", "Creative", "Unique"],
        chain: "ethereum",
        category: "art",
        status: "auction",
        likes: 278,
        views: 1876,
        isNew: false,
        isTrending: false,
        description: "Unique crypto art representing creative innovation."
    },
    {
        id: 20,
        name: "Digital Masterpiece #1",
        collection: "Digital Masterpieces",
        image: "./resources/nft-20.jpg",
        price: "28.9",
        currency: "ETH",
        owner: "0x8t9U0V1W2X3Y4Z5A6B7C8D9E0",
        creator: "0x8t9U0V1W2X3Y4Z5A6B7C8D9E0",
        attributes: ["Masterpiece", "Premium", "Exclusive"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 834,
        views: 5432,
        isNew: false,
        isTrending: true,
        description: "An exclusive digital masterpiece of premium quality."
    },

    {
        id: 21,
        name: "Pixel Warrior #101",
        collection: "Pixel Warriors",
        image: "./resources/nft-21.png",
        price: "1.5",
        currency: "ETH",
        owner: "0x9k1L2M3N4O5P6Q7R8S9T0U1V2",
        creator: "0x9k1L2M3N4O5P6Q7R8S9T0U1V2",
        attributes: ["Pixel", "Warrior", "8-bit"],
        chain: "ethereum",
        category: "gaming",
        status: "new",
        likes: 189,
        views: 1456,
        isNew: true,
        isTrending: false,
        description: "8-bit pixel warrior ready for battle."
    },
    {
        id: 22,
        name: "Abstract Mind #77",
        collection: "Abstract Minds",
        image: "./resources/nft-22.jpeg",
        price: "3.2",
        currency: "ETH",
        owner: "0x0l2M3N4O5P6Q7R8S9T0U1V2W3",
        creator: "0x0l2M3N4O5P6Q7R8S9T0U1V2W3",
        attributes: ["Abstract", "Mind", "Colorful"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 298,
        views: 1876,
        isNew: false,
        isTrending: false,
        description: "Abstract representation of the creative mind."
    },
    {
        id: 23,
        name: "Digital Canvas #45",
        collection: "Digital Canvases",
        image: "./resources/nft-23.jpg",
        price: "2.8",
        currency: "ETH",
        owner: "0x1m3N4O5P6Q7R8S9T0U1V2W3X4",
        creator: "0x1m3N4O5P6Q7R8S9T0U1V2W3X4",
        attributes: ["Canvas", "Digital", "Art"],
        chain: "ethereum",
        category: "art",
        status: "auction",
        likes: 412,
        views: 2567,
        isNew: false,
        isTrending: false,
        description: "A beautiful digital canvas painting."
    },
    {
        id: 24,
        name: "Art Collection #88",
        collection: "Art Collections",
        image: "./resources/nft-24.png",
        price: "4.5",
        currency: "ETH",
        owner: "0x2n4O5P6Q7R8S9T0U1V2W3X4Y5",
        creator: "0x2n4O5P6Q7R8S9T0U1V2W3X4Y5",
        attributes: ["Collection", "Art", "Premium"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 567,
        views: 3456,
        isNew: false,
        isTrending: true,
        description: "Premium art collection piece."
    },
    {
        id: 25,
        name: "Music Vibes #66",
        collection: "Music Vibes",
        image: "./resources/nft-25.jpg",
        price: "1.9",
        currency: "ETH",
        owner: "0x3o5P6Q7R8S9T0U1V2W3X4Y5Z6",
        creator: "0x3o5P6Q7R8S9T0U1V2W3X4Y5Z6",
        attributes: ["Music", "Vibes", "Sound"],
        chain: "ethereum",
        category: "music",
        status: "new",
        likes: 234,
        views: 1678,
        isNew: true,
        isTrending: false,
        description: "Musical vibes captured in digital form."
    },
    {
        id: 26,
        name: "Celebrity Star #99",
        collection: "Celebrity Stars",
        image: "./resources/nft-26.jpg",
        price: "12.3",
        currency: "ETH",
        owner: "0x4p6Q7R8S9T0U1V2W3X4Y5Z6A7",
        creator: "0x4p6Q7R8S9T0U1V2W3X4Y5Z6A7",
        attributes: ["Celebrity", "Star", "Famous"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 789,
        views: 4321,
        isNew: false,
        isTrending: true,
        description: "Famous celebrity captured as digital art."
    },
    {
        id: 27,
        name: "Pixel Art Classic #12",
        collection: "Pixel Art Classics",
        image: "./resources/nft-27.png",
        price: "0.8",
        currency: "ETH",
        owner: "0x5q7R8S9T0U1V2W3X4Y5Z6A7B8",
        creator: "0x5q7R8S9T0U1V2W3X4Y5Z6A7B8",
        attributes: ["Pixel", "Classic", "Retro"],
        chain: "ethereum",
        category: "art",
        status: "auction",
        likes: 156,
        views: 987,
        isNew: false,
        isTrending: false,
        description: "Classic pixel art with retro styling."
    },
    {
        id: 28,
        name: "Abstract Dreams #34",
        collection: "Abstract Dreams",
        image: "./resources/nft-28.png",
        price: "2.7",
        currency: "ETH",
        owner: "0x6r8S9T0U1V2W3X4Y5Z6A7B8C9",
        creator: "0x6r8S9T0U1V2W3X4Y5Z6A7B8C9",
        attributes: ["Abstract", "Dreams", "Colorful"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 345,
        views: 2134,
        isNew: false,
        isTrending: false,
        description: "Colorful abstract dreams in digital form."
    },
    {
        id: 29,
        name: "3D Masterpiece #56",
        collection: "3D Masterpieces",
        image: "./resources/nft-29.png",
        price: "6.4",
        currency: "ETH",
        owner: "0x7s9T0U1V2W3X4Y5Z6A7B8C9D0",
        creator: "0x7s9T0U1V2W3X4Y5Z6A7B8C9D0",
        attributes: ["3D", "Masterpiece", "Sculpture"],
        chain: "ethereum",
        category: "art",
        status: "new",
        likes: 467,
        views: 2890,
        isNew: true,
        isTrending: false,
        description: "Stunning 3D digital sculpture masterpiece."
    },
    {
        id: 30,
        name: "Crypto Universe #23",
        collection: "Crypto Universes",
        image: "./resources/nft-30.jpg",
        price: "3.8",
        currency: "ETH",
        owner: "0x8t0U1V2W3X4Y5Z6A7B8C9D0E1",
        creator: "0x8t0U1V2W3X4Y5Z6A7B8C9D0E1",
        attributes: ["Universe", "Crypto", "Art"],
        chain: "ethereum",
        category: "art",
        status: "auction",
        likes: 289,
        views: 1654,
        isNew: false,
        isTrending: false,
        description: "The entire crypto universe in one digital piece."
    },
    {
        id: 31,
        name: "Pixel Corner #78",
        collection: "Pixel Corners",
        image: "./resources/nft-31.png",
        price: "1.1",
        currency: "ETH",
        owner: "0x9u1V2W3X4Y5Z6A7B8C9D0E1F2",
        creator: "0x9u1V2W3X4Y5Z6A7B8C9D0E1F2",
        attributes: ["Pixel", "Corner", "Art"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 198,
        views: 1234,
        isNew: false,
        isTrending: false,
        description: "Pixel art from the corner of the digital world."
    },
    {
        id: 32,
        name: "Music Beat #89",
        collection: "Music Beats",
        image: "./resources/nft-32.png",
        price: "2.4",
        currency: "ETH",
        owner: "0x0v2W3X4Y5Z6A7B8C9D0E1F2G3",
        creator: "0x0v2W3X4Y5Z6A7B8C9D0E1F2G3",
        attributes: ["Music", "Beat", "Rhythm"],
        chain: "ethereum",
        category: "music",
        status: "new",
        likes: 234,
        views: 1567,
        isNew: true,
        isTrending: false,
        description: "The rhythm and beat of music captured as NFT."
    },
    {
        id: 33,
        name: "Animal Kingdom #45",
        collection: "Animal Kingdoms",
        image: "./resources/nft-33.jpg",
        price: "1.7",
        currency: "ETH",
        owner: "0x1w3X4Y5Z6A7B8C9D0E1F2G3H4",
        creator: "0x1w3X4Y5Z6A7B8C9D0E1F2G3H4",
        attributes: ["Animal", "Kingdom", "Nature"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 345,
        views: 2134,
        isNew: false,
        isTrending: false,
        description: "Beautiful animal from the digital kingdom."
    },
    {
        id: 34,
        name: "Celebrity Icon #67",
        collection: "Celebrity Icons",
        image: "./resources/nft-34.png",
        price: "8.9",
        currency: "ETH",
        owner: "0x2x4Y5Z6A7B8C9D0E1F2G3H4I5",
        creator: "0x2x4Y5Z6A7B8C9D0E1F2G3H4I5",
        attributes: ["Celebrity", "Icon", "Legend"],
        chain: "ethereum",
        category: "art",
        status: "auction",
        likes: 567,
        views: 3456,
        isNew: false,
        isTrending: true,
        description: "Iconic celebrity captured as digital legend."
    },
    {
        id: 35,
        name: "Art Collection Premium #91",
        collection: "Art Collection Premium",
        image: "./resources/nft-35.jpg",
        price: "5.2",
        currency: "ETH",
        owner: "0x3y5Z6A7B8C9D0E1F2G3H4I5J6",
        creator: "0x3y5Z6A7B8C9D0E1F2G3H4I5J6",
        attributes: ["Premium", "Collection", "Art"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 423,
        views: 2789,
        isNew: false,
        isTrending: false,
        description: "Premium piece from an exclusive art collection."
    },
    {
        id: 36,
        name: "Digital Artist Pro #88",
        collection: "Digital Artist Pro",
        image: "./resources/nft-36.jpg",
        price: "4.1",
        currency: "ETH",
        owner: "0x4z6A7B8C9D0E1F2G3H4I5J6K7",
        creator: "0x4z6A7B8C9D0E1F2G3H4I5J6K7",
        attributes: ["Pro", "Artist", "Digital"],
        chain: "ethereum",
        category: "art",
        status: "new",
        likes: 298,
        views: 1876,
        isNew: true,
        isTrending: false,
        description: "Professional digital art from a skilled artist."
    },
    {
        id: 37,
        name: "Gaming Legend #99",
        collection: "Gaming Legends",
        image: "./resources/nft-37.png",
        price: "7.3",
        currency: "ETH",
        owner: "0x5a7B8C9D0E1F2G3H4I5J6K8L9",
        creator: "0x5a7B8C9D0E1F2G3H4I5J6K8L9",
        attributes: ["Gaming", "Legend", "Epic"],
        chain: "ethereum",
        category: "gaming",
        status: "buy-now",
        likes: 634,
        views: 3678,
        isNew: false,
        isTrending: true,
        description: "Epic gaming legend immortalized as NFT."
    },
    {
        id: 38,
        name: "NFT Collection Elite #76",
        collection: "NFT Collection Elite",
        image: "./resources/nft-38.jpg",
        price: "3.9",
        currency: "ETH",
        owner: "0x6b8C9D0E1F2G3H4I5J6K8L9M0",
        creator: "0x6b8C9D0E1F2G3H4I5J6K8L9M0",
        attributes: ["Elite", "Collection", "Premium"],
        chain: "ethereum",
        category: "art",
        status: "auction",
        likes: 389,
        views: 2456,
        isNew: false,
        isTrending: false,
        description: "Elite piece from a premium NFT collection."
    },
    {
        id: 39,
        name: "Digital Art Collection #55",
        collection: "Digital Art Collections",
        image: "./resources/nft-39.jpg",
        price: "2.6",
        currency: "ETH",
        owner: "0x7c9D0E1F2G3H4I5J6K8L9M0N1",
        creator: "0x7c9D0E1F2G3H4I5J6K8L9M0N1",
        attributes: ["Collection", "Digital", "Art"],
        chain: "ethereum",
        category: "art",
        status: "new",
        likes: 267,
        views: 1654,
        isNew: true,
        isTrending: false,
        description: "Beautiful digital art from an exclusive collection."
    },
    {
        id: 40,
        name: "Crypto Art Universe #44",
        collection: "Crypto Art Universes",
        image: "./resources/nft-40.jpg",
        price: "4.8",
        currency: "ETH",
        owner: "0x8d0E1F2G3H4I5J6K8L9M0N1O2",
        creator: "0x8d0E1F2G3H4I5J6K8L9M0N1O2",
        attributes: ["Universe", "Crypto", "Art"],
        chain: "ethereum",
        category: "art",
        status: "buy-now",
        likes: 445,
        views: 2876,
        isNew: false,
        isTrending: false,
        description: "The entire crypto art universe in one piece."
    }
];


document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

async function initializeApp() {
    nftData = [...mockNftData];
    filteredNftData = [...nftData];



    initializeCarousel();
    initializeEventListeners();
    initializeFilters();


    loadNftGrid();


    initializeUserData();


    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                currentAccount = accounts[0];
                updateWalletUI();
                loadUserData();
            }
        } catch (error) {
            console.error('Error checking MetaMask connection:', error);
        }
    }
}

async function quickSellNft(nftId) {
    const nft = nftData.find(n => n.id === nftId);
    if (!nft) return;
    const sellPrice = parseFloat(nft.price) * 0.9;
    if (!confirm(`Are you sure you want to quick sell ${nft.name} for ${sellPrice.toFixed(4)} ETH? This action is instant.`)) return;

    try {
        const result = await Market.simulateQuickSellByMockId(nftId);
        if (!result.success) {
            alert(result.message || 'Quick sell failed');
            return;
        }
        alert(`Sold ${nft.name} for ${sellPrice.toFixed(4)} ETH!`);
        loadNftGrid();
        loadUserData();
    } catch (err) {
        console.error('Quick sell failed', err);
        alert('Quick sell failed. Please try again.');
    }
}

// MetaMask Integration
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to continue.');
        return;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        updateWalletUI();
        loadUserData();

        // Add event listener for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        console.log('Wallet connected:', currentAccount);
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

function disconnectWallet() {
    currentAccount = null;
    updateWalletUI();
    clearUserData();

    // Remove event listeners
    if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        currentAccount = accounts[0];
        updateWalletUI();
        loadUserData();
    }
}

function handleChainChanged(chainId) {
    console.log('Chain changed:', chainId);
    // You might want to reload the page or update UI based on the new chain
}

function updateWalletUI() {
    const connectBtn = document.getElementById('connectWallet');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');

    if (currentAccount) {
        connectBtn.classList.add('hidden');
        walletInfo.classList.remove('hidden');
        walletAddress.textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
    } else {
        connectBtn.classList.remove('hidden');
        walletInfo.classList.add('hidden');
    }
}

// User Data Management
function initializeUserData() {
    // Initialize user data structures
    userNfts = [];
    userListings = [];
}

function loadUserData() {
    if (!currentAccount) return;

    // Simulate loading user NFTs and listings
    userNfts = nftData.filter(nft => nft.owner === currentAccount);
    userListings = nftData.filter(nft => nft.owner === currentAccount && nft.status === 'buy-now');

    console.log('User NFTs loaded:', userNfts.length);
    console.log('User listings loaded:', userListings.length);
}

function clearUserData() {
    userNfts = [];
    userListings = [];
}

// Initialize carousel
function initializeCarousel() {
    // Featured collections carousel
    new Splide('#featured-carousel', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '1rem',
        autoplay: true,
        interval: 4000,
        breakpoints: {
            768: {
                perPage: 2,
            },
            480: {
                perPage: 1,
            }
        }
    }).mount();

    // New NFTs carousel
    new Splide('#new-nfts-carousel', {
        type: 'loop',
        perPage: 4,
        perMove: 1,
        gap: '1rem',
        autoplay: true,
        interval: 3000,
        breakpoints: {
            1024: {
                perPage: 3,
            },
            768: {
                perPage: 2,
            },
            480: {
                perPage: 1,
            }
        }
    }).mount();

    // Trending NFTs carousel
    new Splide('#trending-nfts-carousel', {
        type: 'loop',
        perPage: 4,
        perMove: 1,
        gap: '1rem',
        autoplay: true,
        interval: 3500,
        breakpoints: {
            1024: {
                perPage: 3,
            },
            768: {
                perPage: 2,
            },
            480: {
                perPage: 1,
            }
        }
    }).mount();
}

// Event listeners
function initializeEventListeners() {
    // Wallet connection
    document.getElementById('connectWallet').addEventListener('click', connectWallet);

    // Filters
    document.querySelectorAll('.status-filter, .chain-filter, .category-filter').forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', sortNfts);

    // Load more
    document.getElementById('loadMore').addEventListener('click', loadMoreNfts);

    // Modal events
    document.getElementById('cancelPurchase').addEventListener('click', closePurchaseModal);
    document.getElementById('confirmPurchase').addEventListener('click', confirmPurchase);

    // Close modal on background click
    document.getElementById('purchaseModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closePurchaseModal();
        }
    });

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                showComingSoonModal();
            }
        });
    });

    // Create NFT button
    const createNftBtn = document.getElementById('createNftBtn');
    if (createNftBtn) {
        createNftBtn.addEventListener('click', showCreateNftModal);
    }

    // Demo money functionality removed.

    // Sell NFT button
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('sell-nft-btn')) {
            const nftId = parseInt(e.target.dataset.nftId);
            showSellNftModal(nftId);
        }
    });
}

// Filter functionality
function initializeFilters() {
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    priceRange.addEventListener('input', function () {
        // Update price filter (simplified for demo)
        applyFilters();
    });
}

function applyFilters() {
    let filtered = [...nftData];

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
    const maxPrice = parseFloat(document.getElementById('priceRange').value);
    filtered = filtered.filter(nft => parseFloat(nft.price) <= maxPrice);

    filteredNftData = filtered;
    currentPage = 1;
    loadNftGrid();
}

function sortNfts() {
    const sortValue = document.getElementById('sortSelect').value;

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
    if (endIndex >= filteredNftData.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

function loadMoreNfts() {
    currentPage++;
    loadNftGrid();
}

function createNftCard(nft) {
    const card = document.createElement('div');
    card.className = 'nft-card rounded-xl overflow-hidden cursor-pointer';
    card.onclick = () => openPurchaseModal(nft);

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
        <div class="p-4">
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
            ${isOwnedByUser ? '<div class="text-xs text-green-400 mb-2">✓ You own this NFT</div>' : ''}
            ${isOwnedByUser ? `<button class="sell-nft-btn mt-2 w-full btn-secondary py-1 rounded text-sm" data-nft-id="${nft.id}">Sell NFT</button>` : ''}
            ${isOwnedByUser ? `<button class="quick-sell-btn mt-2 w-full bg-green-500 bg-opacity-20 text-green-400 hover:bg-opacity-30 py-1 rounded text-sm">Quick Sell</button>` : ''}
            ${!isOwnedByUser && isForSale ? `<button class="buy-now-btn mt-2 w-full btn-primary py-2 rounded text-sm">Buy Now</button>` : ''}
            ${!isOwnedByUser && nft.status === 'auction' ? `<button class="btn-secondary mt-2 w-full py-2 rounded text-sm view-auction">Place Bid</button>` : ''}
            ${!isOwnedByUser && nft.status === 'offers' ? `<button class="btn-secondary mt-2 w-full py-2 rounded text-sm view-offers">View Offers</button>` : ''}
            ${isCreatedByUser && !isOwnedByUser ? `<button class="delete-nft-btn mt-2 w-full bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 py-1 rounded text-sm" onclick="event.stopPropagation(); deleteNft(${nft.id})">Delete</button>` : ''}
        </div>
    `;
    // Attach buy event handler if buy button exists
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
    const quickSellBtn = card.querySelector('.quick-sell-btn');
    if (quickSellBtn) {
        quickSellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            quickSellNft(nft.id);
        });
    }

    return card;
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
    modalNftPrice.textContent = `${nft.price} ${nft.currency}`;
    modalNftDescription.textContent = nft.description || 'No description available.';

    // Calculate total with service fee
    const price = parseFloat(nft.price);
    const serviceFee = price * 0.025;
    const total = price + serviceFee;
    modalTotalPrice.textContent = `${total.toFixed(4)} ${nft.currency}`;

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
    const nft = nftData.find(n => n.id === nftId);

    if (!nft) {
        alert('NFT not found.');
        return;
    }

    // Check if user already owns this NFT
    if (nft.owner === currentAccount) {
        alert('You already own this NFT!');
        return;
    }

    try {
        const confirmBtn = document.getElementById('confirmPurchase');
        const originalText = confirmBtn.textContent;
        const txProgress = document.getElementById('txProgress');
        const txStatus = document.getElementById('txStatus');
        const txBar = document.getElementById('txProgressBar');
        const txHashEl = document.getElementById('txHash');
        confirmBtn.textContent = 'Processing...';
        confirmBtn.disabled = true;
        txProgress.classList.remove('hidden');
        txStatus.textContent = 'Awaiting confirmation...';
        txBar.style.width = '10%';
        txHashEl.textContent = '';

        const updateProgress = (v, s) => { txBar.style.width = `${v}%`; txStatus.textContent = s; };
        await new Promise(resolve => setTimeout(resolve, 800));
        updateProgress(30, 'Confirming on chain...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress(60, 'Finalizing transaction...');

        const result = await Market.simulatePurchaseByMockId(nft.id, currentAccount || 'You');
        if (!result.success) {
            alert(result.message || 'Purchase failed');
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            txProgress.classList.add('hidden');
            return;
        }

        updateProgress(100, 'Completed');
        txHashEl.textContent = `Transaction: ${result.txHash}`;
        setTimeout(() => {
            closePurchaseModal();
            loadNftGrid();
            loadUserData();
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            txProgress.classList.add('hidden');
            alert(`Purchase successful! You now own ${nft.name}.\n\nTransaction Hash: ${result.txHash}`);
        }, 800);
    } catch (err) {
        console.error('Transaction failed:', err);
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

    const nft = nftData.find(n => n.id === nftId);
    if (!nft) {
        alert('NFT not found.');
        return;
    }

    // Check if user owns this NFT
    if (nft.owner !== currentAccount) {
        alert('You do not own this NFT!');
        return;
    }

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

    const nft = nftData.find(n => n.id === nftId);
    if (!nft) {
        alert('NFT not found.');
        return;
    }

    (async () => {
        const result = await Market.simulateListByMockId(nftId, sellPrice);
        if (!result.success) {
            alert(result.message || 'Failed to list NFT');
            return;
        }
        alert(`${nft.name} has been listed for sale at ${sellPrice} ETH!`);
        closeSellModal();
        loadNftGrid();
        loadUserData();
    })();
}

// Create NFT Modal with Image Upload
function showCreateNftModal() {
    if (!currentAccount) {
        alert('Please connect your wallet first to create NFTs.');
        return;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal fixed inset-0 z-50';
    modal.innerHTML = `
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="modal-content rounded-xl p-6 max-w-md w-full">
                <div class="text-center">
                    <h3 class="text-2xl font-bold mb-4">Create New NFT</h3>
                    
                    <div class="space-y-4 mb-6 text-left">
                        <div>
                            <label class="block text-sm font-medium mb-2">NFT Image</label>
                            <div class="border-2 border-dashed border-white border-opacity-20 rounded-lg p-4 text-center">
                                <input type="file" id="nftImage" accept="image/*" class="hidden">
                                <div id="imagePreview" class="mb-2 hidden">
                                    <img id="previewImg" class="w-20 h-20 object-cover rounded-lg mx-auto">
                                </div>
                                <button type="button" onclick="document.getElementById('nftImage').click()" class="btn-secondary px-4 py-2 rounded text-sm">
                                    Choose Image
                                </button>
                                <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">NFT Name</label>
                            <input type="text" id="nftName" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white" placeholder="Enter NFT name">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Collection</label>
                            <input type="text" id="nftCollection" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white" placeholder="Enter collection name">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Price (ETH)</label>
                            <input type="number" id="nftPrice" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white" placeholder="Enter price" step="0.01" min="0">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Description</label>
                            <textarea id="nftDescription" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white" placeholder="Enter description" rows="3"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Category</label>
                            <select id="nftCategory" class="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2 text-white">
                                <option value="art">Art</option>
                                <option value="gaming">Gaming</option>
                                <option value="music">Music</option>
                                <option value="domains">Domain Names</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex space-x-4">
                        <button onclick="closeCreateModal()" class="btn-secondary flex-1 py-3 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button onclick="confirmCreateNft()" class="btn-primary flex-1 py-3 rounded-lg font-medium">
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
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImg.src = e.target.result;
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });
}

function closeCreateModal() {
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

function confirmCreateNft() {
    const name = document.getElementById('nftName').value;
    const collection = document.getElementById('nftCollection').value;
    const price = document.getElementById('nftPrice').value;
    const description = document.getElementById('nftDescription').value;
    const category = document.getElementById('nftCategory').value;
    const imageInput = document.getElementById('nftImage');

    if (!name || !collection || !price || !description) {
        alert('Please fill in all fields.');
        return;
    }

    if (!imageInput.files[0]) {
        alert('Please select an image for your NFT.');
        return;
    }

    // For demo purposes, use a placeholder image
    const imageUrl = `./resources/nft-${Math.floor(Math.random() * 40) + 1}.jpg`;

    // Create new NFT object
    const newNft = {
        id: nftData.length + 1,
        name: name,
        collection: collection,
        image: imageUrl,
        price: price,
        currency: "ETH",
        owner: currentAccount,
        creator: currentAccount,
        attributes: ["New", "Created", "Custom"],
        chain: "ethereum",
        category: category,
        status: "buy-now",
        likes: 0,
        views: 0,
        isNew: true,
        isTrending: false,
        description: description
    };

    // Add to NFT data
    nftData.push(newNft);
    filteredNftData = [...nftData];

    alert(`${name} has been created and listed for sale!`);

    closeCreateModal();
    loadNftGrid();
    loadUserData();
}

// Coming Soon Modal
function showComingSoonModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fixed inset-0 z-50';
    modal.innerHTML = `
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="modal-content rounded-xl p-6 max-w-sm w-full text-center">
                <div class="text-6xl mb-4">🚀</div>
                <h3 class="text-2xl font-bold mb-2">Coming Soon!</h3>
                <p class="text-gray-400 mb-6">This feature is currently under development.</p>
                <button onclick="closeComingSoonModal()" class="btn-primary px-6 py-3 rounded-lg font-medium">
                    Got it!
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
}

function closeComingSoonModal() {
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

// Utility functions
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
}

// Add scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutQuart'
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animation
    document.querySelectorAll('.nft-card, .trending-token, .stat-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Initialize scroll animations after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeScrollAnimations, 500);
});