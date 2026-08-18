import { Container, SimpleGrid, Paper, Title, Text, Group, ThemeIcon } from '@mantine/core';
import { IconCalendarEvent, IconCalendarStats } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    title: 'Типы событий',
    description: 'Создание, редактирование и удаление типов событий',
    icon: IconCalendarEvent,
    color: 'blue',
    link: '/owner/event-types',
  },
  {
    title: 'Бронирования',
    description: 'Просмотр всех бронирований',
    icon: IconCalendarStats,
    color: 'green',
    link: '/owner/bookings',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Container size="md">
      <Title order={2} mb="lg">Панель владельца</Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {cards.map((card) => (
          <Paper
            key={card.title}
            withBorder
            p="xl"
            radius="md"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(card.link)}
          >
            <Group>
              <ThemeIcon size="xl" radius="md" color={card.color}>
                <card.icon size={24} />
              </ThemeIcon>
              <div>
                <Title order={4}>{card.title}</Title>
                <Text size="sm" c="dimmed">{card.description}</Text>
              </div>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>
    </Container>
  );
}
