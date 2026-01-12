'use client';

import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';

export default function AppHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                🎬 MovieDB
              </div>
            </Link>

            <nav className="hidden md:flex gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </Link>
            </nav>
          </div>

          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            className="md:hidden"
          />
        </div>
      </header>

      <Drawer
        title="Menu"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <div className="flex flex-col gap-4">
          <Link href="/" onClick={() => setDrawerOpen(false)}>
            <Button type="text" className="w-full justify-start" size="large">
              Home
            </Button>
          </Link>
        </div>
      </Drawer>
    </>
  );
}
