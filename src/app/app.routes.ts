import { Routes } from "@angular/router";
import { AuthGuard } from "@auth0/auth0-angular";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
        data: { show: false },
    },
    {
        path: "home",
        loadComponent: () =>
            import("./pages/home/home.component").then((m) => m.HomeComponent),
        data: { show: true, i18n: "HOME", icon: "home.svg" },
    },
    {
        path: "menu",
        loadComponent: () =>
            import("./pages/home/home.component").then((m) => m.HomeComponent),
        data: { show: true, i18n: "MENU", icon: "newspaper.svg" },
    },
    {
        path: "reviews",
        loadComponent: () =>
            import("./pages/home/home.component").then((m) => m.HomeComponent),
        data: { show: true, i18n: "REVIEWS", icon: "star.svg" },
    },
    {
        path: "competitors",
        loadComponent: () =>
            import("./pages/home/home.component").then((m) => m.HomeComponent),
        data: { show: true, i18n: "COMPETITORS", icon: "shield.svg" },
    },
    {
        path: "profile",
        loadComponent: () =>
            import("./pages/profile/profile.component").then(
                (m) => m.ProfileComponent
            ),
        canActivate: [AuthGuard],
        data: { show: false },
    },
];
