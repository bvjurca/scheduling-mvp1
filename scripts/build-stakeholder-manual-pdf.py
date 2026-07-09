from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "dsa-scheduling-mvp1-stakeholder-manual.pdf"


def p(text, style):
    return Paragraph(text, style)


def bullets(items, style):
    return ListFlowable(
        [ListItem(Paragraph(item, style), leftIndent=12) for item in items],
        bulletType="bullet",
        leftIndent=14,
        bulletFontName="Helvetica",
        bulletFontSize=8,
    )


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#657282"))
    canvas.drawString(0.7 * inch, 0.42 * inch, "DSA Commercial Scheduling MVP1 - Stakeholder Manual")
    canvas.drawRightString(7.8 * inch, 0.42 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleBlue",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#123f72"),
            alignment=TA_LEFT,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Section",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#0b65a3"),
            spaceBefore=12,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyTight",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.6,
            leading=13,
            textColor=colors.HexColor("#27313d"),
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Callout",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#34305f"),
            backColor=colors.HexColor("#eeecfb"),
            borderColor=colors.HexColor("#574fa0"),
            borderWidth=0.8,
            borderPadding=8,
            spaceBefore=6,
            spaceAfter=10,
        )
    )

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.7 * inch,
        leftMargin=0.7 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.7 * inch,
        title="DSA Commercial Scheduling MVP1 Stakeholder Manual",
    )

    story = [
        p("DSA Commercial Scheduling MVP1", styles["TitleBlue"]),
        p("Stakeholder Manual", styles["Heading3"]),
        p(
            "This PDF carries the narrative that was intentionally removed from the hosted demo. "
            "The Netlify view should stay focused on the wizard and decision console.",
            styles["BodyTight"],
        ),
        p("Blueprint Anchor", styles["Section"]),
        p(
            'MVP1 is a Commercial Persona workflow for "Just Say Yes" / "In The Know." '
            "It begins with SFDC intake, uses Opportunity Start Date as the mandatory gate date, "
            "checks whether the target start is more than four months out, asks for missing "
            "configuration data, calculates site/month options, and gives Commercial an eligible proposal window or an off-ramp.",
            styles["BodyTight"],
        ),
        p(
            "Do not change the scope: MVP1 does not reserve capacity, optimize room-level schedules, "
            "replace Central Scheduling, or create a final operational execution date.",
            styles["Callout"],
        ),
        p("Latest VoC Synthesis", styles["Section"]),
        bullets(
            [
                "Snapshot, not promise: PowerBI/RACE timing is useful, but perishable. Commercial needs validity language: eligible to propose, not reserved, recheck required after expiry or scope change.",
                "Date semantics are risky: requested start can mean in vivo start, LabSci method start, test material availability, or customer submission timing.",
                "RFP already has data: preferred site, triage site, requested start, management triage release, test material, LabSci triage, study design, and comments.",
                "Budgetary is different: budgetary estimates can tolerate quarter or broad timing; ready-to-execute and specific-date requests require stricter checks.",
                "Site flexibility is leverage: a broader region or any qualified site can unlock earlier month options.",
                "Free text still matters: email, Teams, notes, and description fields hold constraints that rules may not parse.",
            ],
            styles["BodyTight"],
        ),
        p("Current-State Observations", styles["Section"]),
        bullets(
            [
                "The Opportunity page is the commercial home base: stages, studies, RFP, files/SOW, Proposal Builder, notes, award, and health check.",
                "The Study detail page already contains Scheduling Status values such as Timing Requested, Escalate Capabilities, Escalate Timing, Confirmed, Scheduling Expired, Requested Month Of, Confirmed Month Of, and Placeholder states.",
                "Those status values are useful, but they mix recommendation state, timing precision, validity, off-ramp reason, and commitment level.",
                "The Configurator and Study Support Component View contain rich operational signals, but MVP1 should use them to qualify and caveat Commercial recommendations, not automate micro-scheduling.",
            ],
            styles["BodyTight"],
        ),
        p(
            "Screenshots are not embedded in the hosted deployable package because they include current SFDC context and customer/opportunity examples. They were used as design reference only.",
            styles["Callout"],
        ),
        PageBreak(),
        p("Recommended Field Model", styles["Section"]),
        p("Split the current Scheduling Status concept into clearer MVP1 states.", styles["BodyTight"]),
    ]

    table = Table(
        [
            ["Current mixed concept", "MVP1 model"],
            ["Not Confirmed / Confirmed", "Recommendation state"],
            ["Requested Month Of / Confirmed Month Of", "Timing precision and commitment level"],
            ["Scheduling Expired", "Validity state"],
            ["Escalate Timing / Escalate Capabilities", "Central Scheduling off-ramp reason"],
            ["Placeholder", "Date-source confidence and commitment level"],
        ],
        colWidths=[2.6 * inch, 4.0 * inch],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e7f2fb")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#123f72")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("LEADING", (0, 0), (-1, -1), 12),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d8dee6")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.extend(
        [
            table,
            Spacer(1, 14),
            p("Stakeholder-Safe Product Line", styles["Section"]),
            p(
                "The Configurator and SFDC/RFP data give us enough structured study context to improve Commercial scheduling confidence. "
                "MVP1 should use that context to qualify, recommend, caveat, and escalate. It should not reserve capacity or override Scheduling judgment.",
                styles["Callout"],
            ),
            p("Demo Boundary", styles["Section"]),
            bullets(
                [
                    "Hosted demo: wizard plus decision console only.",
                    "Top state tabs are connected to the actual wizard evaluation state.",
                    "Snapshot recommendations are selectable as UI state only.",
                    "Side reading: this PDF.",
                ],
                styles["BodyTight"],
            ),
        ]
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(OUTPUT)


if __name__ == "__main__":
    build()
