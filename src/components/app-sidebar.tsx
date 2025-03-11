'use client';

import * as React from 'react';

import { SearchForm } from '@/components/search-form';
import { VersionSwitcher } from '@/components/version-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

const data = {
  versions: ['UP04 - Salto', 'UP05 - Simões Filho', 'UP06 - Amparo'],
  navMain: [
    {
      title: 'Acompanhamento',
      url: 'dashboard',
      items: [
        {
          title: 'Formulários PTP',
          url: 'ptps',
        },
        {
          title: 'Laudos CRM',
          url: 'laudos',
        },
        {
          title: 'Divergências',
          url: 'divergencias',
        },
      ],
    },
    // {
    //   title: 'Building Your Application',
    //   url: '#',
    //   items: [
    //     {
    //       title: 'Routing',
    //       url: '#',
    //     },
    //     {
    //       title: 'Data Fetching',
    //       url: '#',
    //       isActive: true,
    //     },
    //     {
    //       title: 'Rendering',
    //       url: '#',
    //     },
    //     {
    //       title: 'Caching',
    //       url: '#',
    //     },
    //     {
    //       title: 'Styling',
    //       url: '#',
    //     },
    //     {
    //       title: 'Optimizing',
    //       url: '#',
    //     },
    //     {
    //       title: 'Configuring',
    //       url: '#',
    //     },
    //     {
    //       title: 'Testing',
    //       url: '#',
    //     },
    //     {
    //       title: 'Authentication',
    //       url: '#',
    //     },
    //     {
    //       title: 'Deploying',
    //       url: '#',
    //     },
    //     {
    //       title: 'Upgrading',
    //       url: '#',
    //     },
    //     {
    //       title: 'Examples',
    //       url: '#',
    //     },
    //   ],
    // },
    // {
    //   title: 'API Reference',
    //   url: '#',
    //   items: [
    //     {
    //       title: 'Components',
    //       url: '#',
    //     },
    //     {
    //       title: 'File Conventions',
    //       url: '#',
    //     },
    //     {
    //       title: 'Functions',
    //       url: '#',
    //     },
    //     {
    //       title: 'next.config.js Options',
    //       url: '#',
    //     },
    //     {
    //       title: 'CLI',
    //       url: '#',
    //     },
    //     {
    //       title: 'Edge Runtime',
    //       url: '#',
    //     },
    //   ],
    // },
    // {
    //   title: 'Architecture',
    //   url: '#',
    //   items: [
    //     {
    //       title: 'Accessibility',
    //       url: '#',
    //     },
    //     {
    //       title: 'Fast Refresh',
    //       url: '#',
    //     },
    //     {
    //       title: 'Next.js Compiler',
    //       url: '#',
    //     },
    //     {
    //       title: 'Supported Browsers',
    //       url: '#',
    //     },
    //     {
    //       title: 'Turbopack',
    //       url: '#',
    //     },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map(item => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(item.url)}
                    >
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
