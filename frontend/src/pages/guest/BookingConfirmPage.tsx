import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Text, Title, Paper } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import type { components } from '../../lib/api.types';

type Slot = components['schemas']['Slot'];
type EventType = components['schemas']['EventType'];

interface LocationState {
  slot: Slot;
  eventType: EventType;
  guestName: string;
  guestEmail: string;
}

export function BookingConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state) {
    return (
      <Container>
        <Text>Нет данных о бронировании.</Text>
        <Button mt="md" onClick={() => navigate('/')}>На главную</Button>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
        <IconCircleCheck size={48} color="var(--mantine-color-green-6)" />
        <Title order={2} mt="md">Бронирование подтверждено!</Title>
        <Text mt="sm">
          Вы записаны на <strong>{state.eventType.title}</strong>
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          {new Date(state.slot.startTime).toLocaleString('ru-RU')} — {new Date(state.slot.endTime).toLocaleTimeString('ru-RU')}
        </Text>
        <Text size="sm" mt="md">
          {state.guestName}, {state.guestEmail}
        </Text>
        <Button mt="xl" onClick={() => navigate('/')}>На главную</Button>
      </Paper>
    </Container>
  );
}
