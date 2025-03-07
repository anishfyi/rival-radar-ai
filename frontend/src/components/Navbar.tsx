'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', current: pathname === '/' },
    { name: 'Competitors', href: '/competitors', current: pathname === '/competitors' },
    { name: 'Analysis', href: '/analysis', current: pathname === '/analysis' },
  ];

  return (
    <Disclosure as="nav" className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-apple-gray-100">
      {({ open }) => (
        <>
          <div className="apple-container">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-semibold text-apple-gray-900">Rival Radar</span>
                </div>
                <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                  {isLoggedIn && navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        item.current
                          ? 'text-primary-600 border-primary-600'
                          : 'text-apple-gray-500 hover:text-apple-gray-900 border-transparent hover:border-apple-gray-300'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="apple-button-secondary py-2 px-4 text-sm"
                  >
                    Sign out
                  </button>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      href="/login"
                      className="apple-button-secondary py-2 px-4 text-sm"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="apple-button py-2 px-4 text-sm"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-apple-gray-400 hover:text-apple-gray-500 hover:bg-apple-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {isLoggedIn && navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={`${
                    item.current
                      ? 'bg-primary-50 border-primary-600 text-primary-600'
                      : 'border-transparent text-apple-gray-500 hover:bg-apple-gray-50 hover:border-apple-gray-300 hover:text-apple-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-apple-gray-200">
              {isLoggedIn ? (
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-apple-gray-500 hover:text-apple-gray-800 hover:bg-apple-gray-100"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              ) : (
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as="a"
                    href="/login"
                    className="block px-4 py-2 text-base font-medium text-apple-gray-500 hover:text-apple-gray-800 hover:bg-apple-gray-100"
                  >
                    Sign in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="/register"
                    className="block px-4 py-2 text-base font-medium text-apple-gray-500 hover:text-apple-gray-800 hover:bg-apple-gray-100"
                  >
                    Sign up
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 