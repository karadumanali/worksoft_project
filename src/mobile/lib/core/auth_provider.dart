import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final _storage = const FlutterSecureStorage();
  final _api = ApiService();

  String? _token;
  String? _role;
  String? _fullName;
  bool _isLoading = false;

  String? get token => _token;
  String? get role => _role;
  String? get fullName => _fullName;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null;

  // Uygulama açılınca token var mı kontrol et
  Future<void> tryAutoLogin() async {
    final token = await _storage.read(key: 'jwt_token');
    if (token != null && !JwtDecoder.isExpired(token)) {
      _token = token;
      _parseToken(token);
      notifyListeners();
    }
  }

  // Login
  Future<String?> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );

      final token = response.data['data']['token'];
      await _storage.write(key: 'jwt_token', value: token);
      _token = token;
      _parseToken(token);
      _isLoading = false;
      notifyListeners();
      return null; // başarılı, hata yok
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return 'E-posta veya şifre hatalı';
    }
  }

  // Logout
  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
    _token = null;
    _role = null;
    _fullName = null;
    notifyListeners();
  }

  void updateFullName(String newName) {
    _fullName = newName;
    notifyListeners();
  }

  // Token içinden rol ve isim oku
  void _parseToken(String token) {
    final decoded = JwtDecoder.decode(token);
    _role =
        decoded['role'] ??
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    _fullName =
        decoded['fullName'] ??
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  }
}
