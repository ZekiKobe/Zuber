import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import 'otp_verification_screen.dart';

class PhoneVerificationScreen extends StatefulWidget {
  const PhoneVerificationScreen({Key? key}) : super(key: key);

  @override
  State<PhoneVerificationScreen> createState() => _PhoneVerificationScreenState();
}

class _PhoneVerificationScreenState extends State<PhoneVerificationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();

  bool _isLoading = false;

  bool _isPhoneValid() {
    String phoneNumber = _phoneController.text.trim();
    // Remove any non-digit characters to check actual digit count
    String digitsOnly = phoneNumber.replaceAll(RegExp(r'\D'), '');
    // Expect 9-10 digits after removing prefixes like +251
    return digitsOnly.length >= 9 && digitsOnly.length <= 10;
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _requestCode() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    try {
      final success = await authProvider.requestVerificationCode(
        phoneNumber: _phoneController.text.trim(),
        email: null, // Only using phone number for SMS verification
      );

      if (success && mounted) {
        // Navigate to OTP verification screen
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => OtpVerificationScreen(
              phoneNumber: _phoneController.text.trim(),
              email: null, // Only using phone number for SMS verification
            ),
          ),
        );
      } else if (mounted && authProvider.error != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(authProvider.error!),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to send verification code: $e'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurfaceColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(AppTheme.spacingXL),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                const SizedBox(height: AppTheme.spacingXXL),
                
                // Logo
                Container(
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: AppTheme.primaryGradient,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.phone,
                    size: 50,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: AppTheme.spacingXL),
                
                Text(
                  'Verify Your Phone',
                  style: AppTheme.heading1.copyWith(
                    color: AppTheme.darkTextPrimary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppTheme.spacingS),
                Text(
                  'We\'ll send you a verification code',
                  style: AppTheme.bodyMedium.copyWith(
                    color: AppTheme.darkTextSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppTheme.spacingXXL),

                // Phone Number Field
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'Phone Number',
                    labelStyle: TextStyle(color: AppTheme.darkTextSecondary),
                    hintText: '+251912345678',
                    hintStyle: TextStyle(color: AppTheme.darkTextTertiary),
                    prefixIcon: Icon(Icons.phone, color: AppTheme.primaryColor),
                    prefixText: '+251 ',
                    prefixStyle: TextStyle(color: AppTheme.darkTextSecondary),
                    filled: true,
                    fillColor: AppTheme.darkCardColor,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      borderSide: BorderSide(color: AppTheme.darkDividerColor),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      borderSide: BorderSide(color: AppTheme.darkDividerColor),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      borderSide: BorderSide(
                        color: AppTheme.primaryColor,
                        width: 2,
                      ),
                    ),
                  ),
                  onChanged: (_) {
                    // Trigger rebuild to update button state
                    setState(() {});
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your phone number';
                    }
                    // Clean the input to check actual digit count
                    String digitsOnly = value.replaceAll(RegExp(r'\D'), '');
                    if (digitsOnly.length < 9 || digitsOnly.length > 10) {
                      return 'Please enter a valid 9-10 digit phone number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppTheme.spacingL),

                const SizedBox(height: AppTheme.spacingXL),

                // Request Code Button
                Container(
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: _isPhoneValid() && !_isLoading ? AppTheme.primaryGradient : AppTheme.disabledGradient,
                    borderRadius: BorderRadius.circular(AppTheme.radiusM),
                    boxShadow: AppTheme.elevatedShadow,
                  ),
                  child: ElevatedButton(
                    onPressed: _isLoading || !_isPhoneValid() ? null : _requestCode,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      ),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 24,
                            width: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : Text(
                            'Request Code',
                            style: AppTheme.buttonText,
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      ),
    );
  }
}