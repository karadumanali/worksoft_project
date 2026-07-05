import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'core/auth_provider.dart';
import 'features/auth/login_screen.dart';
import 'features/dashboard/dashboard_screen.dart';
import 'features/tasks/tasks_screen.dart';
import 'features/announcements/announcements_screen.dart';
import 'features/users/users_screen.dart';

GoRouter createRouter(BuildContext context) {
  final authProvider = Provider.of<AuthProvider>(context, listen: false);

  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final isLoggedIn = authProvider.isAuthenticated;
      final isLoginPage = state.matchedLocation == '/login';

      if (!isLoggedIn && !isLoginPage) return '/login';
      if (isLoggedIn && isLoginPage) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/tasks',
            builder: (context, state) => const TasksScreen(),
          ),
          GoRoute(
            path: '/announcements',
            builder: (context, state) => const AnnouncementsScreen(),
          ),
          GoRoute(
            path: '/users',
            builder: (context, state) {
              final auth = Provider.of<AuthProvider>(context, listen: false);
              if (auth.role != 'Admin') return const DashboardScreen();
              return const UsersScreen();
            },
          ),
        ],
      ),
    ],
  );
}

class MainShell extends StatelessWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final role = auth.role;
    final location = GoRouterState.of(context).matchedLocation;

    return Scaffold(
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _getIndex(location),
        onDestinationSelected: (index) => _navigate(context, index, role),
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          const NavigationDestination(
            icon: Icon(Icons.task),
            label: 'Görevler',
          ),
          const NavigationDestination(
            icon: Icon(Icons.campaign),
            label: 'Duyurular',
          ),
          if (role == 'Admin')
            const NavigationDestination(
              icon: Icon(Icons.people),
              label: 'Kullanıcılar',
            ),
        ],
      ),
    );
  }

  int _getIndex(String location) {
    if (location.startsWith('/dashboard')) return 0;
    if (location.startsWith('/tasks')) return 1;
    if (location.startsWith('/announcements')) return 2;
    if (location.startsWith('/users')) return 3;
    return 0;
  }

  void _navigate(BuildContext context, int index, String? role) {
    switch (index) {
      case 0:
        context.go('/dashboard');
        break;
      case 1:
        context.go('/tasks');
        break;
      case 2:
        context.go('/announcements');
        break;
      case 3:
        context.go('/users');
        break;
    }
  }
}
