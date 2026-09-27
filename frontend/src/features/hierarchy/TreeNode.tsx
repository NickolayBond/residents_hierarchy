import { useState, useCallback } from 'react';
import { useAppSelector } from '../../app/hooks';
import type { HierarchyNode } from '../../types';
import { CitizenBadge } from './CitizenBadge';
import { FaGlobe, FaCity, FaHome, FaRoad, FaBuilding, FaUser } from 'react-icons/fa';
import { MdArrowForwardIos } from 'react-icons/md';

const LABELS: Record<string, string> = {
  root: 'Все жители',
  country: 'Страна',
  city: 'Город',
  district: 'Район',
  street: 'Улица',
  house: 'Дом',
  citizen: 'Житель',
};

const ICONS: Record<string, React.ReactNode> = {
  country: <FaGlobe />,
  city: <FaCity />,
  district: <FaHome />,
  street: <FaRoad />,
  house: <FaBuilding />,
  citizen: <FaUser />,
};

interface Props {
  node: HierarchyNode;
  depth: number;
}

export function TreeNode({ node, depth }: Props) {
  const [open, setOpen] = useState(depth < 2);
  const cities = useAppSelector((s) => s.hierarchy.cities);

  const handleToggle = useCallback(() => {
    if (node.children.length > 0) {
      setOpen((v) => !v);
    }
  }, [node.children.length]);

  if (node.type === 'citizen') {
    const city = node.meta?.cityId ? cities[node.meta.cityId] : undefined;
    const tooltip = city
      ? `${city.name}, ${city.data} жителей`
      : undefined;

    return (
      <li className="tree__item tree__item--citizen">
        <CitizenBadge name={node.name} tooltip={tooltip} />
      </li>
    );
  }

  const hasChildren = node.children.length > 0;

  return (
    <li className={`tree__item tree__item--${node.type}`}>
      <div
        className={`tree__node ${open ? 'tree__node--open' : ''}`}
        onClick={handleToggle}
        role={hasChildren ? 'button' : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {hasChildren && (
          <span className="tree__arrow">
            <MdArrowForwardIos />
          </span>
        )}
        {!hasChildren && <span className="tree__arrow" style={{ visibility: 'hidden' }} />}
        <span className="tree__type">{ICONS[node.type] ?? '📁'} {LABELS[node.type] ?? node.type}</span>
        <span className="tree__name">{node.name}</span>
        {typeof node.citizensCount === 'number' && (
          <span className="tree__count">{node.citizensCount} <FaUser /></span>
        )}
      </div>

      {hasChildren && (
        <div
          className="tree__children-wrapper"
          style={{
            display: open ? 'block' : 'none',
            animation: open ? 'slideDown 0.3s ease' : undefined,
          }}
        >
          <ul className="tree__children">
            {node.children.map((child, i) => (
              /* P.S. лучше использовать id узла, чем индекс. Но id у нас неуникальные, потому делаем так. */
              <TreeNode key={i} node={child} depth={depth + 1} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
