import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/classname.ts';
import { Filter, X } from 'lucide-react';
import {
  deleteUrlParam,
  getUrlParams,
  setUrlParams,
} from '../../lib/browser.ts';
import { CategoryFilterButton } from '../Roadmaps/CategoryFilterButton.tsx';
import {
  projectDifficulties,
  type ProjectFileType,
} from '../../lib/project.ts';
import { ProjectCard } from './ProjectCard.tsx';

type ProjectsPageProps = {
  roadmapsProjects: {
    id: string;
    title: string;
    projects: ProjectFileType[];
  }[];
  userCounts: Record<string, number>;
};

export function ProjectsPage(props: ProjectsPageProps) {
  const { roadmapsProjects, userCounts } = props;
  const allUniqueProjectIds = new Set<string>(
    roadmapsProjects.flatMap((group) =>
      group.projects.map((project) => project.id),
    ),
  );
  const allUniqueProjects = useMemo(
    () =>
      Array.from(allUniqueProjectIds)
        .map((id) =>
          roadmapsProjects
            .flatMap((group) => group.projects)
            .find((project) => project.id === id),
        )
        .filter(Boolean) as ProjectFileType[],
    [allUniqueProjectIds],
  );

  const [activeGroup, setActiveGroup] = useState<string>('');
  const [visibleProjects, setVisibleProjects] =
    useState<ProjectFileType[]>(allUniqueProjects);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const { g } = getUrlParams() as { g: string };
    if (!g) {
      return;
    }

    setActiveGroup(g);
    const group = roadmapsProjects.find((group) => group.id === g);
    if (!group) {
      return;
    }

    setVisibleProjects(group.projects);
  }, []);

  const sortedVisibleProjects = useMemo(
    () =>
      visibleProjects.sort((a, b) => {
        const projectADifficulty = a?.frontmatter.difficulty || 'beginner';
        const projectBDifficulty = b?.frontmatter.difficulty || 'beginner';
        return (
          projectDifficulties.indexOf(projectADifficulty) -
          projectDifficulties.indexOf(projectBDifficulty)
        );
      }),
    [visibleProjects],
  );

  return (
    <div className="border-t bg-gray-100">
      <button
        onClick={() => {
          setIsFilterOpen(!isFilterOpen);
        }}
        id="filter-button"
        className={cn(
          '-mt-1 flex w-full items-center justify-center bg-gray-300 py-2 text-sm text-black focus:shadow-none focus:outline-0 sm:hidden',
          {
            'mb-3': !isFilterOpen,
          },
        )}
      >
        {!isFilterOpen && <Filter size={13} className="mr-1" />}
        {isFilterOpen && <X size={13} className="mr-1" />}
        Categories
      </button>
      <div className="container relative flex flex-col gap-4 sm:flex-row">
        <div
          className={cn(
            'hidden w-full flex-col from-gray-100 sm:w-[160px] sm:shrink-0 sm:border-r sm:bg-gradient-to-l sm:pt-6',
            {
              'hidden sm:flex': !isFilterOpen,
              'z-50 flex': isFilterOpen,
            },
          )}
        >
          <div className="absolute top-0 -mx-4 w-full bg-white pb-0 shadow-xl sm:sticky sm:top-10 sm:mx-0 sm:bg-transparent sm:pb-20 sm:shadow-none">
            <div className="grid grid-cols-1">
              <CategoryFilterButton
                onClick={() => {
                  setActiveGroup('');
                  setVisibleProjects(allUniqueProjects);
                  setIsFilterOpen(false);
                  deleteUrlParam('g');
                }}
                category={'All Projects'}
                selected={activeGroup === ''}
              />

              {roadmapsProjects.map((group) => (
                <CategoryFilterButton
                  key={group.id}
                  onClick={() => {
                    setActiveGroup(group.id);
                    setIsFilterOpen(false);
                    document?.getElementById('filter-button')?.scrollIntoView();
                    setVisibleProjects(group.projects);
                    setUrlParams({ g: group.id });
                  }}
                  category={group.title}
                  selected={activeGroup === group.id}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-grow flex-col gap-6 pb-20 pt-2 sm:pt-6">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {sortedVisibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                userCount={userCounts[project.id] || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
