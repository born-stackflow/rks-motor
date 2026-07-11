export interface B2BConfirmationEmailData {
  contactName: string
  businessName: string
  businessType: string
  city: string
  country: string
  modelsOfInterest: string[]
  estimatedQuantity?: string
  siteUrl?: string
  siteEmail?: string
  sitePhone?: string
  siteAddress?: string
}

export const generateB2BConfirmationEmail = (data: B2BConfirmationEmailData) => {
  const subject = 'Trade Application Received - RKS'
  
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
        .details h3 { margin-top: 0; color: #1d3557; font-size: 18px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
        .detail-item { }
        .detail-label { font-weight: 600; color: #1d3557; }
        .detail-value { color: #666; }
        .models-list { background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .models-list h4 { margin-top: 0; color: #1565c0; }
        .models-list ul { margin: 10px 0; padding-left: 20px; }
        .timeline { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .timeline h3 { margin-top: 0; color: #856404; }
        .timeline ol { margin: 10px 0; padding-left: 20px; }
        .timeline li { margin: 8px 0; }
        .cta { text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background-color: #e63946; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; margin: 0 10px; }
        .cta-button.secondary { background-color: #1d3557; }
        .footer { background-color: #1d3557; color: white; padding: 20px; text-align: center; }
        .footer p { margin: 5px 0; }
        .footer a { color: #ffd166; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>RKS</h1>
            <p>Trade Partner Program</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <h2>Trade Application Received</h2>
            
            <p>Dear ${data.contactName},</p>
            
            <p>Thank you for applying to become an authorized RKS trade partner. We have successfully received your application for <strong>${data.businessName}</strong>.</p>
            
            <div class="details">
                <h3>Application Summary</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">Business Name</div>
                        <div class="detail-value">${data.businessName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Business Type</div>
                        <div class="detail-value">${data.businessType.charAt(0).toUpperCase() + data.businessType.slice(1)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Location</div>
                        <div class="detail-value">${data.city}, ${data.country}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Est. Volume</div>
                        <div class="detail-value">${data.estimatedQuantity || 'To be determined'}</div>
                    </div>
                </div>
                
                ${data.modelsOfInterest.length > 0 ? `
                <div class="models-list">
                    <h4>Models of Interest</h4>
                    <ul>
                        ${data.modelsOfInterest.map(model => `<li>${model}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
            
            <div class="timeline">
                <h3>What Happens Next</h3>
                <ol>
                    <li><strong>Application Review:</strong> Our sales team will review your application and assess compatibility with our brand standards.</li>
                    <li><strong>Personalized Offer:</strong> Within 2 business days, you'll receive a customized trade offer with pricing, terms, and territory details.</li>
                    <li><strong>Partnership Agreement:</strong> Once you accept the offer, we'll finalize the partnership agreement and onboarding process.</li>
                    <li><strong>Training & Support:</strong> Access to product training, marketing materials, and ongoing support from your dedicated account manager.</li>
                </ol>
            </div>
            
            <p><strong>Our sales team will contact you within 2 business days</strong> with a personalized trade offer tailored to your business requirements.</p>
            
            <div class="cta">
                <a href="${data.siteUrl || 'https://rks-motorcycles.com'}/trade" class="cta-button">Partnership Information</a>
                <a href="${data.siteUrl || 'https://rks-motorcycles.com'}/models" class="cta-button secondary">Browse Our Range</a>
            </div>

            <p>If you have any immediate questions about your application or our trade program, please contact our sales team:</p>
            <p><strong>Trade Sales Team:</strong> ${data.siteEmail || 'sales@rks-motorcycles.com'}<br>
            <strong>Phone:</strong> ${data.sitePhone || '+39 02 1234 5678'}<br>
            <strong>Hours:</strong> Monday-Friday, 9:00-18:00 CET</p>
            
            <p>We're excited about the possibility of partnering with ${data.businessName} and look forward to supporting your business growth.</p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>RKS Trade Division</strong></p>
            <p>${data.siteAddress || 'Via Milano 123, 20121 Milan, Italy'}</p>
            <p>Trade Sales: ${data.siteEmail || 'sales@rks-motorcycles.com'} | Phone: ${data.sitePhone || '+39 02 1234 5678'}</p>
            
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                Built by <a href="#">Tech Logies</a> | 
                <a href="#">Trade Terms</a> | 
                <a href="#">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
  `
  
  return { subject, html }
}