import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Group, Table, Text, Title, ActionIcon } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { api } from '../../lib/api';
import type { components } from '../../lib/api.types';

type EventType = components['schemas']['EventType'];

export function EventTypesListPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEventTypes = () => {
    api.GET('/api/event-types').then(({ data }) => {
      if (data) {
        setEventTypes(data);
      }
      setLoading(false);
    });
  };

  useEffect(fetchEventTypes, []);

  const handleDelete = async (id: string) => {
    const { error } = await api.DELETE('/api/event-types/{id}', {
      params: { path: { id } },
    });

    if (error) {
      notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось удалить тип события' });
      return;
    }

    notifications.show({ color: 'green', title: 'Удалено', message: 'Тип события удалён' });
    fetchEventTypes();
  };

  if (loading) {
    return <Container><Text>Загрузка...</Text></Container>;
  }

  const rows = eventTypes.map((et) => (
    <Table.Tr key={et.id}>
      <Table.Td>{et.title}</Table.Td>
      <Table.Td>{et.description || '—'}</Table.Td>
      <Table.Td>{et.durationMinutes} мин</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="blue" onClick={() => navigate(`/owner/event-types/${et.id}/edit`)}>
            <IconEdit size={18} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(et.id)}>
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="lg">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Типы событий</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => navigate('/owner/event-types/new')}>
          Создать
        </Button>
      </Group>

      {eventTypes.length === 0 ? (
        <Text c="dimmed">Пока нет типов событий</Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Название</Table.Th>
              <Table.Th>Описание</Table.Th>
              <Table.Th>Длительность</Table.Th>
              <Table.Th>Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </Container>
  );
}
