import { formatStatus, getStatusPillClass } from "@/lib/utils";

export default function OrderStatusBadge({ status }) {
  const formattedStatus = formatStatus(status);
  const className = getStatusPillClass(status);
  
  return (
    <span className={className}>
      {formattedStatus}
    </span>
  );
}
