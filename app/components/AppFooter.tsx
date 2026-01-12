'use client';

import { Layout } from 'antd';

const { Footer } = Layout;

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Footer className="bg-gray-100 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mt-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">About MovieDB</h4>
            <p className="text-sm text-gray-600">
              Explore millions of movies and discover your next favorite film powered by TMDB.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-600 hover:text-blue-600">
                  Home
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
          <p>
            © {currentYear} MovieDB. All rights reserved.
          </p>
        </div>
      </div>
    </Footer>
  );
}
