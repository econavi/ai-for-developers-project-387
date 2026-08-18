import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarStats,
  IconLayoutDashboard,
  IconList,
} from '@tabler/icons-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const guestLinks = [
  { label: 'Типы событий', to: '/', icon: IconCalendarEvent },
];

const ownerLinks = [
  { label: 'Дашборд', to: '/owner', icon: IconLayoutDashboard },
  { label: 'Типы событий', to: '/owner/event-types', icon: IconList },
  { label: 'Бронирования', to: '/owner/bookings', icon: IconCalendarStats },
];

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const isOwner = location.pathname.startsWith('/owner');

  const links = isOwner ? ownerLinks : guestLinks;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <IconCalendarPlus size={28} />
            <Title order={4}>Calendar Call</Title>
          </Group>
          <NavLink
            label={isOwner ? 'Режим гостя' : 'Режим владельца'}
            href={isOwner ? '/' : '/owner'}
            variant="subtle"
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {links.map((link) => (
          <NavLink
            key={link.to}
            label={link.label}
            leftSection={<link.icon size={20} />}
            active={location.pathname === link.to}
            onClick={() => {
              navigate(link.to);
              toggle();
            }}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
