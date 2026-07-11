export interface B2CConfirmationEmailData {
  customerName: string
  modelInterested?: string
  enquiryType: string
  message: string
  siteUrl?: string
  siteEmail?: string
  sitePhone?: string
  siteAddress?: string
}

export const generateB2CConfirmationEmail = (data: B2CConfirmationEmailData) => {
  const subject = 'We received your enquiry - RKS'
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #1d3557 0%, #e63946 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .content h2 { color: #1d3557; margin-top: 0; }
        .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .details h3 { margin-top: 0; color: #1d3557; }
        .details ul { margin: 10px 0; padding-left: 20px; }
        .details li { margin: 5px 0; }
        .cta { text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background-color: #e63946; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; }
        .footer { background-color: #1d3557; color: white; padding: 20px; text-align: center; }
        .footer p { margin: 5px 0; }
        .footer a { color: #ffd166; text-decoration: none; }
        .social { margin-top: 15px; }
        .social a { color: #ffd166; margin: 0 10px; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>RKS</h1>
            <p>Premium Motorcycles & Parts</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <h2>Thank you for your enquiry!</h2>
            
            <p>Dear ${data.customerName},</p>
            
            <p>We have received your enquiry and our experienced team will be in touch within 24 hours to assist you with your motorcycle needs.</p>
            
            <div class="details">
                <h3>Enquiry Summary</h3>
                <ul>
                    ${data.modelInterested ? `<li><strong>Model of Interest:</strong> ${data.modelInterested}</li>` : ''}
                    <li><strong>Enquiry Type:</strong> ${data.enquiryType.charAt(0).toUpperCase() + data.enquiryType.slice(1).replace('-', ' ')}</li>
                    <li><strong>Your Message:</strong> "${data.message}"</li>
                </ul>
            </div>
            
            <p>In the meantime, feel free to explore our range of premium motorcycles and genuine parts on our website.</p>
            
            <div class="cta">
                <a href="${data.siteUrl || 'https://rks-motorcycles.com'}/models" class="cta-button">View Our Models</a>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>A member of our team will contact you within 24 hours</li>
                <li>We'll provide detailed information about your enquiry</li>
                <li>If you're interested in a test ride, we'll help arrange it at your nearest dealer</li>
                <li>Our experts will answer any technical or pricing questions</li>
            </ul>
            
            <p>If you have any urgent questions, please don't hesitate to contact us directly:</p>
            <p><strong>Phone:</strong> ${data.sitePhone || '+39 02 1234 5678'}<br>
            <strong>Email:</strong> ${data.siteEmail || 'info@rks-motorcycles.com'}</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>RKS</strong></p>
            <p>${data.siteAddress || 'Via Milano 123, 20121 Milan, Italy'}</p>
            <p>Phone: ${data.sitePhone || '+39 02 1234 5678'} | Email: ${data.siteEmail || 'info@rks-motorcycles.com'}</p>
            
            <div class="social">
                <a href="#">Facebook</a> |
                <a href="#">Instagram</a> |
                <a href="#">YouTube</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                Built by <a href="#">Tech Logies</a> | 
                <a href="#">Privacy Policy</a> | 
                <a href="#">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
  `
  
  return { subject, html }
}