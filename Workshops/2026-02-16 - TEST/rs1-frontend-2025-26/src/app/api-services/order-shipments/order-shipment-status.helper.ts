import { OrderShipmentStatusType } from './order-shipments-api.models';

const labels: Record<OrderShipmentStatusType, string> = {
  [OrderShipmentStatusType.Kreirana]: 'Kreirana',
  [OrderShipmentStatusType.USkladistu]: 'U skladištu',
  [OrderShipmentStatusType.UDostavi]: 'U dostavi',
  [OrderShipmentStatusType.Dostavljena]: 'Dostavljena',
  [OrderShipmentStatusType.Otkazana]: 'Otkazana'
};

export function orderShipmentStatusLabel(status: OrderShipmentStatusType): string {
  return labels[status] ?? String(status);
}

export const orderShipmentStatusOptions = [
  { value: OrderShipmentStatusType.Kreirana, label: labels[OrderShipmentStatusType.Kreirana] },
  { value: OrderShipmentStatusType.USkladistu, label: labels[OrderShipmentStatusType.USkladistu] },
  { value: OrderShipmentStatusType.UDostavi, label: labels[OrderShipmentStatusType.UDostavi] },
  { value: OrderShipmentStatusType.Dostavljena, label: labels[OrderShipmentStatusType.Dostavljena] },
  { value: OrderShipmentStatusType.Otkazana, label: labels[OrderShipmentStatusType.Otkazana] }
];
