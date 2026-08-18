import { useEffect, useState } from 'react';
import { Container, Table, Text, Title } from '@mantine/core';
import { api } from '../../lib/api';
import type { components } from '../../lib/api.types';

type Booking = components['schemas']['Booking'];

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.GET('/api/bookings').then(({ data }) => {
      if (data) {
        setBookings(data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Container><Text>Загрузка...</Text></Container>;
  }

  const rows = bookings.map((b) => (
    <Table.Tr key={b.id}>
      <Table.Td>{b.guestName}</Table.Td>
      <Table.Td>{b.guestEmail}</Table.Td>
      <Table.Td>{new Date(b.startTime).toLocaleString('ru-RU')}</Table.Td>
      <Table.Td>{new Date(b.endTime).toLocaleString('ru-RU')}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="lg">
      <Title order={2} mb="lg">Бронирования</Title>
      {bookings.length === 0 ? (
        <Text c="dimmed">Пока нет бронирований</Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Гость</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Начало</Table.Th>
              <Table.Th>Конец</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </Container>
  );
}
