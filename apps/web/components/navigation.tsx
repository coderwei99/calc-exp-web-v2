"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Calculator, Table } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: '升级计算器',
      icon: Calculator
    },
    {
      href: '/level-experience',
      label: '等级经验对照表',
      icon: Table
    }
  ];

  return (
    <nav className="flex space-x-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              isActive 
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}