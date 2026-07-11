interface SiteContactOverrides {
  siteUrl?: string
  siteEmail?: string
  sitePhone?: string
  siteAddress?: string
}

export interface B2CPartsConfirmationEmailData extends SiteContactOverrides {
  customerName: string
  partName: string
  partNumber?: string
  compatibleModel?: string
  quantityRequired: number
  enquiryType: string
}

export interface B2BPartsConfirmationEmailData extends SiteContactOverrides {
  contactName: string
  businessName: string
  partName: string
  partNumber?: string
  quantityRequired: number
  isRecurringOrder?: boolean
  monthlyQuantity?: number
}

export const generateB2CPartsConfirmationEmail = (data: B2CPartsConfirmationEmailData) => {
  const subject = 'Parts Enquiry Received - RKS'
  
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
        .part-details { background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1565c0; }
        .part-details h3 { margin-top: 0; color: #1565c0; font-size: 18px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
        .detail-item { }
        .detail-label { font-weight: 600; color: #1d3557; font-size: 14px; }
        .detail-value { color: #666; font-size: 16px; }
        .timeline { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .timeline h3 { margin-top: 0; color: #1d3557; }
        .timeline ul { margin: 10px 0; padding-left: 20px; }
        .timeline li { margin: 8px 0; }
        .cta { text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background-color: #e63946; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; margin: 0 10px; }
        .cta-button.secondary { background-color: #1d3557; }
        .contact-info { background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; }
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
            <p>🔧 Parts & Accessories</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <h2>Parts Enquiry Received</h2>
            
            <p>Dear ${data.customerName},</p>
            
            <p>Thank you for your parts enquiry. We have received your request and our parts specialists are already checking availability and pricing for you.</p>
            
            <div class="part-details">
                <h3>🔧 Your Parts Request</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">Part Name</div>
                        <div class="detail-value"><strong>${data.partName}</strong></div>
                    </div>
                    ${data.partNumber ? `
                    <div class="detail-item">
                        <div class="detail-label">Part Number</div>
                        <div class="detail-value">${data.partNumber}</div>
                    </div>
                    ` : ''}
                    ${data.compatibleModel ? `
                    <div class="detail-item">
                        <div class="detail-label">Compatible Model</div>
                        <div class="detail-value">${data.compatibleModel}</div>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <div class="detail-label">Quantity</div>
                        <div class="detail-value">${data.quantityRequired}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Enquiry Type</div>
                        <div class="detail-value">${data.enquiryType.charAt(0).toUpperCase() + data.enquiryType.slice(1)}</div>
                    </div>
                </div>
            </div>
            
            <div class="timeline">
                <h3>⏰ What Happens Next</h3>
                <ul>
                    <li><strong>Availability Check:</strong> Our parts team is verifying stock levels and compatibility</li>
                    <li><strong>Pricing:</strong> We'll provide accurate pricing including any applicable discounts</li>
                    <li><strong>Response:</strong> You'll receive a detailed quote within 24 hours</li>
                    <li><strong>Ordering:</strong> If everything looks good, we'll help you place your order quickly</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <p><strong>Need immediate assistance?</strong></p>
                <p>📞 <strong>Parts Hotline:</strong> ${data.sitePhone || '+39 02 1234 5679'}<br>
                📧 <strong>Email:</strong> ${data.siteEmail || 'parts@rks-motorcycles.com'}<br>
                🕒 <strong>Hours:</strong> Monday-Friday 9:00-18:00, Saturday 9:00-13:00 CET</p>
            </div>

            <div class="cta">
                <a href="${data.siteUrl || 'https://rks-motorcycles.com'}/parts" class="cta-button">Browse More Parts</a>
                <a href="${data.siteUrl || 'https://rks-motorcycles.com'}/models" class="cta-button secondary">View Motorcycles</a>
            </div>
            
            <p>Our genuine parts are designed specifically for RKS motorcycles and come with our quality guarantee. We stock both OEM and performance upgrade options.</p>
            
            <p><strong>Why Choose RKS Genuine Parts?</strong></p>
            <ul>
                <li>✅ Perfect fit and compatibility guaranteed</li>
                <li>✅ Premium quality materials and manufacturing</li>
                <li>✅ Warranty coverage and technical support</li>
                <li>✅ Fast shipping across Europe</li>
            </ul>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>RKS Parts Division</strong></p>
            <p>${data.siteAddress || 'Via Milano 123, 20121 Milan, Italy'}</p>
            <p>Parts Hotline: ${data.sitePhone || '+39 02 1234 5679'} | Email: ${data.siteEmail || 'parts@rks-motorcycles.com'}</p>
            
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                Built by <a href="#">Tech Logies</a> | 
                <a href="#">Privacy Policy</a> | 
                <a href="#">Parts Warranty</a>
            </p>
        </div>
    </div>
</body>
</html>
  `
  
  return { subject, html }
}

export const generateB2BPartsConfirmationEmail = (data: B2BPartsConfirmationEmailData) => {
  const subject = 'Bulk Parts Order Request Received - RKS'
  
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
        .order-details { background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7; }
        .order-details h3 { margin-top: 0; color: #856404; font-size: 18px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .details-table td { padding: 10px; text-align: left; border: 1px solid #ddd; vertical-align: top; }
        .details-table td:first-child { background-color: #f8f9fa; font-weight: bold; width: 150px; }
        .priority-notice { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .priority-notice h4 { margin-top: 0; color: #155724; }
        .timeline { background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .timeline h3 { margin-top: 0; color: #1565c0; }
        .timeline ol { margin: 10px 0; padding-left: 20px; }
        .timeline li { margin: 8px 0; }
        .cta { text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background-color: #e63946; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; margin: 0 10px; }
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
            <p>🏢 B2B Parts Division</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <h2>Bulk Parts Order Request Received</h2>
            
            <p>Dear ${data.contactName},</p>
            
            <p>Thank you for your bulk parts order request from <strong>${data.businessName}</strong>. Our B2B sales team has received your enquiry and will prepare a customized trade quote for you.</p>
            
            <div class="order-details">
                <h3>📦 Your Order Request</h3>
                <table class="details-table">
                    <tr><td><strong>Business Name</strong></td><td>${data.businessName}</td></tr>
                    <tr><td><strong>Part Name</strong></td><td><strong>${data.partName}</strong></td></tr>
                    ${data.partNumber ? `<tr><td><strong>Part Number</strong></td><td>${data.partNumber}</td></tr>` : ''}
                    <tr><td><strong>Quantity</strong></td><td><strong style="color: #e63946;">${data.quantityRequired}</strong></td></tr>
                    ${data.isRecurringOrder ? `
                    <tr><td><strong>Order Type</strong></td><td>Recurring Order</td></tr>
                    ${data.monthlyQuantity ? `<tr><td><strong>Monthly Volume</strong></td><td>${data.monthlyQuantity}</td></tr>` : ''}
                    ` : '<tr><td><strong>Order Type</strong></td><td>One-time Order</td></tr>'}
                </table>
            </div>
            
            <div class="priority-notice">
                <h4>🎯 Priority Processing</h4>
                <p><strong>Your request is being processed with high priority.</strong> Our B2B sales team will contact you within 2 business days with:</p>
                <ul>
                    <li>Customized trade pricing based on volume</li>
                    <li>Stock availability confirmation</li>
                    <li>Delivery timeline and shipping options</li>
                    <li>Payment terms and invoicing details</li>
                </ul>
            </div>
            
            <div class="timeline">
                <h3>📋 Next Steps Process</h3>
                <ol>
                    <li><strong>Quote Preparation:</strong> Our sales team is preparing your customized trade quote</li>
                    <li><strong>Stock Verification:</strong> We're checking availability across our distribution network</li>
                    <li><strong>Pricing Review:</strong> Volume discounts and trade terms are being calculated</li>
                    <li><strong>Contact & Quote:</strong> You'll receive a detailed quote within 2 business days</li>
                    <li><strong>Order Processing:</strong> Once approved, we'll process your order immediately</li>
                </ol>
            </div>
            
            <p><strong>Dedicated B2B Support:</strong> As a trade customer, you'll have access to:</p>
            <ul>
                <li>🎯 Dedicated account manager</li>
                <li>💰 Volume-based pricing tiers</li>
                <li>🚚 Priority shipping and logistics</li>
                <li>📋 Flexible payment terms</li>
                <li>🔧 Technical support and training</li>
            </ul>
            
            <div class="cta">
                <a href="${data.siteUrl || 'https://rks-motorcycles.com'}/trade" class="cta-button">B2B Portal</a>
                <a href="${data.siteUrl || 'https://rks-motorcycles.com'}/parts" class="cta-button secondary">View Parts Catalog</a>
            </div>

            <p><strong>Need immediate assistance?</strong><br>
            📞 <strong>B2B Sales Direct:</strong> ${data.sitePhone || '+39 02 1234 5680'}<br>
            📧 <strong>Email:</strong> ${data.siteEmail || 'trade@rks-motorcycles.com'}<br>
            🕒 <strong>Hours:</strong> Monday-Friday, 8:30-18:30 CET</p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>RKS B2B Sales Division</strong></p>
            <p>${data.siteAddress || 'Via Milano 123, 20121 Milan, Italy'}</p>
            <p>B2B Sales: ${data.siteEmail || 'trade@rks-motorcycles.com'} | Direct: ${data.sitePhone || '+39 02 1234 5680'}</p>
            
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                Built by <a href="#">Tech Logies</a> | 
                <a href="#">Trade Terms</a> | 
                <a href="#">B2B Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
  `
  
  return { subject, html }
}