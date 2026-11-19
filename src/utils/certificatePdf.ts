import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { CertificateRecord } from '../types/course';

export function getCertificateVerificationUrl(certId: string): string {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://itcourses.dev';
  return `${origin}/verify/${encodeURIComponent(certId)}`;
}

export async function generateCertificateQrDataUrl(certId: string): Promise<string> {
  const url = getCertificateVerificationUrl(certId);
  return QRCode.toDataURL(url, {
    width: 180,
    margin: 1,
    color: {
      dark: '#0F172A',
      light: '#FFFFFF',
    },
  });
}

export async function downloadCertificatePdf(cert: CertificateRecord): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const width = doc.internal.pageSize.getWidth(); // 841.89
  const height = doc.internal.pageSize.getHeight(); // 595.28

  // Crisp ivory-white background
  doc.setFillColor(250, 251, 254);
  doc.rect(0, 0, width, height, 'F');

  // Subtle top indigo bar
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, width, 14, 'F');

  // Outer frame
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.5);
  doc.rect(28, 34, width - 56, height - 62);

  // Inner subtle slate frame
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.75);
  doc.rect(38, 44, width - 76, height - 82);

  // Brand lockup top left
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(64, 70, 32, 32, 6, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('IT', 73, 91);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('IT Courses', 108, 86);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Technical Learning & Interview Preparation Platform', 108, 100);

  // Certificate credential tag top right
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('VERIFIED COMPLETION CREDENTIAL', width - 64, 84, { align: 'right' });
  doc.setTextColor(100, 116, 139);
  doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  doc.text(cert.id, width - 64, 99, { align: 'right' });

  // Horizontal divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(64, 124, width - 64, 124);

  // Main certificate heading
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('CERTIFICATE OF ACHIEVEMENT', width / 2, 174, { align: 'center' });

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(13);
  doc.text('This certifies that', width / 2, 206, { align: 'center' });

  // Learner Name
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(34);
  doc.text(cert.learnerName, width / 2, 252, { align: 'center' });

  // Underline beneath learner name
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.5);
  doc.line(width / 2 - 170, 266, width / 2 + 170, 266);

  // Course accomplishment statement
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.text('has successfully completed all sections, assessments, final examination, and project for', width / 2, 298, {
    align: 'center',
  });

  // Course Title
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(`${cert.courseTitle} Engineering Track`, width / 2, 338, {
    align: 'center',
  });

  // Level & Area subtitle
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`${cert.levelLabel}  |  Domain: ${cert.courseArea}`, width / 2, 362, {
    align: 'center',
  });

  // Stats / Metadata bar
  const issuedDateFormatted = new Date(cert.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(140, 386, width - 280, 48, 6, 6, 'F');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('FINAL SCORE', 210, 404, { align: 'center' });
  doc.text('COMPLETION DATE', width / 2, 404, { align: 'center' });
  doc.text('CERTIFICATE ID', width - 210, 404, { align: 'center' });

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${cert.finalScore}%`, 210, 423, { align: 'center' });
  doc.text(issuedDateFormatted, width / 2, 423, { align: 'center' });
  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.text(cert.id, width - 210, 423, { align: 'center' });

  // Footer signature + QR code
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.75);
  doc.line(74, 502, 260, 502);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Curriculum Board', 74, 492);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('IT Courses Academic Review', 74, 518);

  // Second verification block
  doc.setDrawColor(148, 163, 184);
  doc.line(310, 502, 496, 502);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Verified Assessment', 310, 492);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('12 Section Quizzes + Timed Exam + Project', 310, 518);

  // QR Code on bottom right
  try {
    const qrDataUrl = await generateCertificateQrDataUrl(cert.id);
    doc.addImage(qrDataUrl, 'PNG', width - 146, 444, 78, 78);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Scan to verify credential', width - 107, 532, { align: 'center' });
  } catch {
    // Fallback text if QR rendering fails in restricted contexts
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(`Verify: ${getCertificateVerificationUrl(cert.id)}`, width - 64, 518, {
      align: 'right',
    });
  }

  const safeSlug = cert.courseSlug.replace(/[^a-z0-9-]/gi, '');
  doc.save(`IT-Courses-Certificate-${safeSlug}-${cert.id}.pdf`);
}
