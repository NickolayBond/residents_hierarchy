import { FaUser } from 'react-icons/fa';

interface Props {
  name: string;
  tooltip?: string;
}


export function CitizenBadge({ name, tooltip }: Props) {
  return (
    <div className="citizen" tabIndex={0}>
      <span className="citizen__avatar">
        <FaUser />
      </span>
      <span className="citizen__name">{name}</span>
      {tooltip && <div className="citizen__tooltip">{tooltip}</div>}
    </div>
  );
}
