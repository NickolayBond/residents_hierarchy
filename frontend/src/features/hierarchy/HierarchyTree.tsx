import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loadHierarchy } from "./hierarchySlice";
import { TreeNode } from "./TreeNode";
import { FaMapMarkerAlt, FaUsers, FaChartBar } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import type { HierarchyNode } from "../../types";

export function HierarchyTree() {
  const dispatch = useAppDispatch();
  const { tree, loading, error } = useAppSelector((s) => s.hierarchy);

  useEffect(() => {
    dispatch(loadHierarchy());
  }, [dispatch]);

  // Подсчет статистики
  const stats = useMemo(() => {
    if (!tree) return null;

    const countNodes = (node: HierarchyNode): number => {
      return (
        1 +
        node.children.reduce(
          (acc: number, child: HierarchyNode) => acc + countNodes(child),
          0,
        )
      );
    };

    const countCitizens = (node: HierarchyNode): number => {
      if (node.type === "citizen") return 1;
      return node.children.reduce(
        (acc: number, child: HierarchyNode) => acc + countCitizens(child),
        0,
      );
    };

    return {
      total: countNodes(tree),
      citizens: countCitizens(tree),
      cities: tree.children.length,
    };
  }, [tree]);

  if (loading) {
    return (
      <div className="state">
        <div className="state__spinner" />
        <div className="state__text">Загрузка иерархии...</div>
        <div className="skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="skeleton__item"
              style={{ width: `${100 - i * 10}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state state--error">
        <div className="state__spinner" />
        <div className="state__text">{error}</div>
      </div>
    );
  }

  if (!tree) return null;

  return (
    <div className="hierarchy">
      <header className="hierarchy__header">
        <h1 className="hierarchy__title">
          <FaHome /> Иерархия жителей
        </h1>

        {stats && (
          <div className="hierarchy__stats">
            <div className="hierarchy__stat">
              <FaMapMarkerAlt />
              <span>Городов:</span>
              <span className="hierarchy__stat-value">{stats.cities}</span>
            </div>
            <div className="hierarchy__stat">
              <FaUsers />
              <span>Жителей:</span>
              <span className="hierarchy__stat-value">{stats.citizens}</span>
            </div>
            <div className="hierarchy__stat">
              <FaChartBar />
              <span>Всего узлов:</span>
              <span className="hierarchy__stat-value">{stats.total}</span>
            </div>
          </div>
        )}
      </header>

      <div className="content-enter">
        <ul className="tree">
          {tree.children.map((child, i) => (
            /* P.S. лучше использовать id узла, чем индекс. Но id у нас неуникальные, потому делаем так. */
            <TreeNode key={i} node={child} depth={0} />
          ))}
        </ul>
      </div>
    </div>
  );
}
