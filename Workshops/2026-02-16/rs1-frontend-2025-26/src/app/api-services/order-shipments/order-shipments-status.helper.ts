import {OrderShipmentStatusType} from './order-shipments-api.model';

/**
 * Helper class for working with Order Status
 *
 * Provides human-readable labels and styling information
 * for order statuses throughout the application.
 */
export class OrderShipmentStatusHelper {

  /**
   * Get human-readable label for order status
   *
   * @param status - Order status enum value
   * @returns Translated label key or default label
   */
  static getLabel(status: OrderShipmentStatusType): string {
    switch (status) {
      case OrderShipmentStatusType.Kreirana:
        return 'Kreirana';
      case OrderShipmentStatusType.USkladistu:
        return 'U Skladistu';
      case OrderShipmentStatusType.UDostavi:
        return 'U Dostavi';
      case OrderShipmentStatusType.Dostavljena:
        return 'Dostavljena';
      case OrderShipmentStatusType.Otkazana:
        return 'Otkazana';
      default:
        return 'Status nepoznat';
    }
  }


}
