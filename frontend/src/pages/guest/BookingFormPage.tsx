import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, TextInput, Title, Text, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '../../lib/api';
import type { components } from '../../lib/api.types';

type Slot = components['schemas']['Slot'];
type EventType = components['schemas']['EventType'];

interface LocationState {
  slot: Slot;
  eventType: EventType;
}

export function BookingFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      guestName: '',
      guestEmail: '',
    },
    validate: {
      guestName: (v: string) => (v.trim().length === 0 ? 'Введите имя' : null),
      guestEmail: (v: string) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Введите корректный email'),
    },
  });

  if (!state?.slot || !state?.eventType) {
    return (
      <Container>
        <Text>Ошибка: не выбран слот. <Button variant="subtle" onClick={() => navigate(`/event-types/${id}`)}>Вернуться</Button></Text>
      </Container>
    );
  }

  const handleSubmit = async (values: { guestName: string; guestEmail: string }) => {
    const { error } = await api.POST('/api/bookings', {
      body: {
        eventTypeId: id!,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        startTime: state.slot.startTime,
      },
    });

    if (error) {
      notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось создать бронирование' });
      return;
    }

    navigate(`/event-types/${id}/confirm`, {
      state: { slot: state.slot, eventType: state.eventType, guestName: values.guestName, guestEmail: values.guestEmail },
    });
  };

  return (
    <Container size="sm">
      <Title order={2}>Бронирование</Title>
      <Text>{state.eventType.title}</Text>
      <Text size="sm" c="dimmed">
        {new Date(state.slot.startTime).toLocaleString('ru-RU')} — {new Date(state.slot.endTime).toLocaleTimeString('ru-RU')}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Ваше имя"
          placeholder="Иван Иванов"
          required
          mt="md"
          key={form.key('guestName')}
          {...form.getInputProps('guestName')}
        />
        <TextInput
          label="Email"
          placeholder="ivan@example.com"
          required
          mt="sm"
          key={form.key('guestEmail')}
          {...form.getInputProps('guestEmail')}
        />
        <Group mt="lg">
          <Button type="submit">Подтвердить бронирование</Button>
          <Button variant="outline" onClick={() => navigate(`/event-types/${id}`)}>Назад</Button>
        </Group>
      </form>
    </Container>
  );
}
