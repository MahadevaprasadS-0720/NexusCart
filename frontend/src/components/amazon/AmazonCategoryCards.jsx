import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AmazonCategoryCards = ({ onSelectCategory }) => {
  const { user } = useAuth();

  const cards = [
    {
      id: 'c1',
      title: 'Revamp your home in style',
      linkText: 'Explore all',
      category: 'Home & Kitchen',
      items: [
        {
          label: 'Cushion covers & throws',
          image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80',
          cat: 'Home & Kitchen'
        },
        {
          label: 'Bedsheets & linen',
          image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80',
          cat: 'Home & Kitchen'
        },
        {
          label: 'Figurines & vases',
          image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
          cat: 'Home & Kitchen'
        },
        {
          label: 'Home storage',
          image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80',
          cat: 'Home & Kitchen'
        }
      ]
    },
    {
      id: 'c2',
      title: 'Appliances for your home | Up to 55% off',
      linkText: 'See more',
      category: 'Appliances',
      items: [
        {
          label: 'Air conditioners',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          cat: 'Appliances'
        },
        {
          label: 'Refrigerators',
          image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=400&q=80',
          cat: 'Appliances'
        },
        {
          label: 'Microwaves',
          image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=400&q=80',
          cat: 'Appliances'
        },
        {
          label: 'Washing machines',
          image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80',
          cat: 'Appliances'
        }
      ]
    },
    {
      id: 'c3',
      title: 'Starting ₹99 | Home improvement & tools',
      linkText: 'Explore more',
      category: 'Home & Kitchen',
      items: [
        {
          label: 'Cleaning supplies',
          image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=400&q=80',
          cat: 'Home & Kitchen'
        },
        {
          label: 'Extension boards',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
          cat: 'Electronics'
        },
        {
          label: 'Power tools & hardware',
          image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
          cat: 'Home & Kitchen'
        },
        {
          label: 'Home lighting',
          image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80',
          cat: 'Home & Kitchen'
        }
      ]
    },
    {
      id: 'c4',
      isAuthCard: true,
      title: user ? 'Welcome to Prime Deals' : 'Sign in for your best experience',
      category: 'All',
      linkText: 'View your account'
    },
    {
      id: 'c5',
      title: 'Up to 60% off | Styles for women',
      linkText: 'End of season sale',
      category: 'Fashion',
      items: [
        {
          label: "Women's clothing",
          image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        },
        {
          label: 'Footwear & heels',
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        },
        {
          label: 'Watches & accessories',
          image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        },
        {
          label: 'Handbags & totes',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        }
      ]
    },
    {
      id: 'c6',
      title: 'Up to 75% off | Top deals in Electronics',
      linkText: 'See all offers',
      category: 'Electronics',
      items: [
        {
          label: 'Laptops & MacBooks',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
          cat: 'Electronics'
        },
        {
          label: 'Wireless headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
          cat: 'Electronics'
        },
        {
          label: 'Smartwatches',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
          cat: 'Electronics'
        },
        {
          label: 'Tablets & iPads',
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
          cat: 'Mobiles'
        }
      ]
    },
    {
      id: 'c7',
      title: 'Latest Smartphones | No Cost EMI available',
      linkText: 'Explore smartphones',
      category: 'Mobiles',
      items: [
        {
          label: 'iPhone 15 Pro Max',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
          cat: 'Mobiles'
        },
        {
          label: 'Galaxy S24 Ultra',
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
          cat: 'Mobiles'
        },
        {
          label: 'Budget under ₹15,000',
          image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
          cat: 'Mobiles'
        },
        {
          label: 'Cases & accessories',
          image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=400&q=80',
          cat: 'Mobiles'
        }
      ]
    },
    {
      id: 'c8',
      title: "Minimum 50% off | Men's Fashion & Footwear",
      linkText: 'Shop men styles',
      category: 'Fashion',
      items: [
        {
          label: 'Sneakers & sports shoes',
          image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        },
        {
          label: 'Casual shirts',
          image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        },
        {
          label: 'Sunglasses',
          image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        },
        {
          label: 'Leather wallets & belts',
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80',
          cat: 'Fashion'
        }
      ]
    }
  ];

  return (
    <div className="relative -mt-20 sm:-mt-36 md:-mt-52 lg:-mt-64 z-20 max-w-[1500px] mx-auto px-2 sm:px-4 font-['Inter'] select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => {
          if (card.isAuthCard) {
            return (
              <div
                key={card.id}
                className="bg-white p-5 rounded-none shadow-md flex flex-col justify-between h-[420px]"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                    {card.title}
                  </h3>

                  {!user ? (
                    <div className="mt-4 space-y-3">
                      <Link
                        to="/login"
                        className="block w-full py-2.5 bg-[#f7ca00] hover:bg-[#f0b800] border border-[#a88734] rounded-md text-center text-xs font-black text-slate-900 shadow-sm cursor-pointer transition-all"
                      >
                        Sign in securely
                      </Link>
                      <p className="text-xs text-slate-600">
                        Sign in to enjoy customized recommendations and faster checkout.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2 text-xs text-slate-700">
                      <p className="font-semibold">
                        Logged in as <span className="font-bold text-slate-900">{user.name}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Enjoy your VIP membership with fast priority dispatch.
                      </p>
                    </div>
                  )}

                  {/* Promo Mini Banner */}
                  <div
                    onClick={() => onSelectCategory && onSelectCategory('Mobiles')}
                    className="mt-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-md cursor-pointer hover:border-amber-400 transition-all"
                  >
                    <span className="text-[10px] font-black text-[#c45500] uppercase tracking-wider">
                      ⚡ SPONSORED DEAL
                    </span>
                    <h4 className="text-xs font-black text-slate-900 mt-1">
                      Apple iPhone 15 Pro Max
                    </h4>
                    <p className="text-[11px] text-slate-600">Flat 15% Instant Savings</p>
                  </div>
                </div>

                <Link
                  to={user ? "/profile" : "/login"}
                  className="text-xs font-medium text-[#007185] hover:text-[#c45500] hover:underline pt-2 inline-block"
                >
                  {card.linkText}
                </Link>
              </div>
            );
          }

          return (
            <div
              key={card.id}
              className="bg-white p-5 rounded-none shadow-md flex flex-col justify-between h-[420px] transition-all hover:shadow-lg"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
                  {card.title}
                </h3>

                {/* 4-Tile Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {card.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectCategory && onSelectCategory(item.cat)}
                      className="group cursor-pointer flex flex-col"
                    >
                      <div className="h-24 sm:h-28 overflow-hidden bg-slate-100 mb-1 rounded-sm">
                        <img
                          src={item.image}
                          alt={item.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-800 leading-tight line-clamp-1 group-hover:text-[#c45500]">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectCategory && onSelectCategory(card.category)}
                className="text-xs font-medium text-[#007185] hover:text-[#c45500] hover:underline pt-3 text-left cursor-pointer"
              >
                {card.linkText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmazonCategoryCards;
