import 'package:flutter/material.dart';
import '../utils/constants.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isLoading;
  final Color? color;
  final Color? textColor;
  final double? width;
  final double? height;
  final BorderSide? borderSide;
  final BorderRadius? borderRadius;

  const CustomButton({
    Key? key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.color,
    this.textColor,
    this.width,
    this.height,
    this.borderSide,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height ?? AppDimensions.buttonHeight,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color ?? AppColors.accent,
          foregroundColor: textColor ?? AppColors.secondary,
          shape: RoundedRectangleBorder(
            borderRadius: borderRadius ?? BorderRadius.circular(AppDimensions.borderRadiusMedium),
            side: borderSide ?? BorderSide.none,
          ),
          elevation: 0,
        ),
        child: isLoading
            ? const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.secondary),
              )
            : Text(
                text,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
      ),
    );
  }
}