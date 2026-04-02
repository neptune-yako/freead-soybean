import type { CustomRoute, ElegantConstRoute, ElegantRoute } from '@elegant-router/types';
import { generatedRoutes } from '../elegant/routes';
import { layouts, views } from '../elegant/imports';
import { transformElegantRoutesToVueRoutes } from '../elegant/transform';

/**
 * custom routes
 *
 * @link https://github.com/soybeanjs/elegant-router?tab=readme-ov-file#custom-route
 */
const customRoutes: CustomRoute[] = [];

/** create routes when the auth route mode is static */
export function createStaticRoutes() {
  const constantRoutes: ElegantRoute[] = [];

  const authRoutes: ElegantRoute[] = [];

  const allRoutes = [...customRoutes, ...generatedRoutes];

  // recursive add roles to management_admin
  function addRolesToRoute(routes: ElegantRoute[]) {
    routes.forEach(route => {
      if ((route as any).name === 'management_admin') {
        Object.assign(route, { meta: { ...route.meta, roles: ['super_admin'] } });
      }

      if ((route as any).name === 'management_redeem') {
        Object.assign(route, { meta: { ...route.meta, roles: ['super_admin', 'operator'] } });
      }

      if (['management_membership', 'management_membership_tiers', 'management_membership_plans', 'management_feedback'].includes((route as any).name)) {
        Object.assign(route, { meta: { ...route.meta, roles: ['super_admin', 'operator'] } });
      }

      if ((route as any).name === 'management_membership_tiers') {
        Object.assign(route, { meta: { ...route.meta, roles: ['super_admin', 'operator'] } });
      }

      if ((route as any).children?.length) {
        addRolesToRoute((route as any).children);
      }
    });
  }

  addRolesToRoute(allRoutes);

  allRoutes.forEach(item => {
    if (item.meta?.constant) {
      constantRoutes.push(item);
    } else {
      authRoutes.push(item);
    }
  });

  return {
    constantRoutes,
    authRoutes
  };
}

/**
 * Get auth vue routes
 *
 * @param routes Elegant routes
 */
export function getAuthVueRoutes(routes: ElegantConstRoute[]) {
  return transformElegantRoutesToVueRoutes(routes, layouts, views);
}
