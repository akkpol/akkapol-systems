## Summary

เปลี่ยนปุ่ม "คุยขอบเขตงาน" / "Start scoped conversation" ให้เปิดแชทบอทแทนการส่งอีเมล

### What changed
- **brand.ts**: ข้อความปุ่มเป็น "สอบถามเพิ่มเติม" / "Ask me anything"
- **StudioHero.tsx**: Hero secondary CTA เปลี่ยนจาก mailto link เป็นเปิด chat widget
- **AkkapolPortfolioPage.tsx**: Services Section primaryAction เปิดแชทแทน mailto
- **ChatContext.tsx** (ใหม่): React context แชร์ chat state ทั้งแอป
- **PortfolioChat.tsx**: ใช้ shared state แทน useState local

## Test Plan
- [x] Build ผ่าน
- [ ] Preview: กดปุ่ม "สอบถามเพิ่มเติม" ทั้ง Hero และ Services → เปิด chat panel
