import type { BuefyNamespace } from 'buefy';

declare global {

}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties  {
        $buefy: BuefyNamespace;
        $t: any;
        $router: VueRouter;
        $route: Route;
		$i18n: VueI18n;
    }
}
