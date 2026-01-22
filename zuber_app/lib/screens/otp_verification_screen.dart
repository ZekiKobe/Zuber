import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';
import 'profile_setup_screen.dart';

class OtpVerificationScreen extends StatefulWidget {
  final String phoneNumber;
  final String? email;

  const OtpVerificationScreen({
    Key? key,
    required this.phoneNumber,
    this.email,
  }) : super(key: key);

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final List<TextEditingController> _otpControllers = List.generate(4, (index) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (index) => FocusNode());
  
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    // Set up listeners to move to next field when 1 digit is entered
    for (int i = 0; i < 4; i++) {
      _otpControllers[i].addListener(() => _onOtpChanged(i));
    }
  }

  void _onOtpChanged(int index) {
    if (_otpControllers[index].text.length == 1 && index < 3) {
      FocusScope.of(context).requestFocus(_focusNodes[index + 1]);
    }
  }

  @override
  void dispose() {
    for (var controller in _otpControllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  Future<void> _verifyCode() async {
    if (_isLoading) return;

    String otpCode = _otpControllers.map((controller) => controller.text).join('');
    
    if (otpCode.length != 4) {
      setState(() {
        _error = 'Please enter the 4-digit code';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    try {
      final success = await authProvider.verifyCode(
        phoneNumber: widget.phoneNumber,
        email: widget.email,
        code: otpCode,
      );

      if (success && mounted) {
        // Navigate to profile setup screen
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => ProfileSetupScreen(
              phoneNumber: widget.phoneNumber,
              email: widget.email,
            ),
          ),
        );
      } else if (mounted && authProvider.error != null) {
        setState(() {
          _error = authProvider.error;
          _isLoading = false;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(authProvider.error!),
              backgroundColor: AppTheme.errorColor,
            ),
          );
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Verification failed: $e';
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Verification failed: $e'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    }
  }

  bool _isCodeComplete() {
    String fullCode = _otpControllers.map((controller) => controller.text).join();
    return fullCode.length == 4;
  }

  void _resendCode() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    try {
      final success = await authProvider.requestVerificationCode(
        phoneNumber: widget.phoneNumber,
        email: widget.email,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('New verification code sent'),
            backgroundColor: AppTheme.successColor,
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
            content: Text('Failed to resend code: $e'),
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
                  Icons.lock,
                  size: 50,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: AppTheme.spacingXL),
              
              Text(
                'Enter Verification Code',
                style: AppTheme.heading1.copyWith(
                  color: AppTheme.darkTextPrimary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppTheme.spacingS),
              Text(
                'We sent a 4-digit code to ${widget.phoneNumber}',
                style: AppTheme.bodyMedium.copyWith(
                  color: AppTheme.darkTextSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppTheme.spacingXXL),

              // OTP Input Fields
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(4, (index) {
                  return Container(
                    width: 70,
                    height: 80,
                    child: TextField(
                      controller: _otpControllers[index],
                      focusNode: _focusNodes[index],
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      maxLength: 1,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      decoration: InputDecoration(
                        counterText: '',
                        filled: true,
                        fillColor: AppTheme.darkCardColor,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppTheme.radiusL),
                          borderSide: BorderSide(
                            color: _error != null 
                                ? Colors.red 
                                : AppTheme.darkDividerColor,
                            width: 2,
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppTheme.radiusL),
                          borderSide: BorderSide(
                            color: _error != null 
                                ? Colors.red 
                                : AppTheme.darkDividerColor,
                            width: 2,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(AppTheme.radiusL),
                          borderSide: BorderSide(
                            color: _error != null 
                                ? Colors.red 
                                : AppTheme.primaryColor,
                            width: 2,
                          ),
                        ),
                        contentPadding: const EdgeInsets.all(20),
                      ),
                      onChanged: (value) {
                        if (value.length == 1 && index < 3) {
                          FocusScope.of(context).requestFocus(_focusNodes[index + 1]);
                        }
                      },
                      onSubmitted: (value) {
                        if (index < 3) {
                          FocusScope.of(context).requestFocus(_focusNodes[index + 1]);
                        } else {
                          _verifyCode();
                        }
                      },
                    ),
                  );
                }),
              ),
              
              if (_error != null)
                Padding(
                  padding: const EdgeInsets.only(top: AppTheme.spacingS),
                  child: Text(
                    _error!,
                    style: const TextStyle(
                      color: Colors.red,
                      fontSize: 14,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),

              const SizedBox(height: 40),

              // Resend Code
              TextButton(
                onPressed: _isLoading ? null : _resendCode,
                child: Text(
                  'Resend Code',
                  style: TextStyle(
                    color: _isLoading ? AppTheme.darkTextTertiary : AppTheme.primaryColor,
                    fontSize: 16,
                  ),
                ),
              ),
              const SizedBox(height: AppTheme.spacingM),

              // Verify Button
              Container(
                height: 56,
                decoration: BoxDecoration(
                  gradient: _isCodeComplete() && !_isLoading ? AppTheme.primaryGradient : AppTheme.disabledGradient,
                  borderRadius: BorderRadius.circular(AppTheme.radiusM),
                  boxShadow: AppTheme.elevatedShadow,
                ),
                child: ElevatedButton(
                  onPressed: _isLoading || !_isCodeComplete() ? null : _verifyCode,
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
                          'Verify',
                          style: AppTheme.buttonText,
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    ),
    );
  }
}