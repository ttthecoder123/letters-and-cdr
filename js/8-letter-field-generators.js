
const generateCCLPrompt = () => {
    const contactMethod = document.getElementById('contactMethod')?.value;
    const contactDate = document.getElementById('contactDate')?.value;
    const charges = getSelectedCharges();
    const plea = document.getElementById('plea')?.value;
    const legalAid = document.getElementById('legalAidStatus')?.value;
    const clientInstructions = document.getElementById('clientInstructions')?.value;
    const nextCourtDate = document.getElementById('nextCourtDate')?.value;
    const requiredAttend = document.getElementById('requiredAttend')?.value;

    let prompt = `Using the CCL template, draft a letter with this information:\n\n`;
    prompt += `CLIENT: ${currentClient.name}\n`;
    prompt += `ADDRESS: ${currentClient.address || 'Not provided'}\n`;
    prompt += `MATTER REF: ${currentClient.matterNumber}\n\n`;

    prompt += `Contact: ${contactMethod} on ${formatDate(contactDate)}\n\n`;

    prompt += `COURT: ${currentClient.court}\n`;
    prompt += `MATTER TYPE: ${currentClient.matterType}\n`;
    prompt += `CHARGES: ${charges}\n\n`;

    if (legalAid === 'Yes') {
        prompt += `LEGAL AID: Yes`;
        const contribution = document.getElementById('contribution')?.value;
        if (contribution) {
            prompt += ` - Contribution: ${contribution}`;
        }
    } else {
        prompt += `PRIVATE CLIENT - Estimate: ${document.getElementById('estimate')?.value || 'TBD'}`;
        if (document.getElementById('depositPaid')?.value === 'Yes') {
            prompt += ` (deposit of ${document.getElementById('depositAmount')?.value} already paid)`;
        }
    }
    prompt += `\n\n`;

    prompt += `PLEA: ${plea}\n`;
    prompt += `CLIENT INSTRUCTIONS: ${clientInstructions}\n`;

    if (nextCourtDate) {
        prompt += `NEXT COURT DATE: ${formatDate(nextCourtDate)}`;
        if (requiredAttend) {
            prompt += ` - Client ${requiredAttend === 'Yes' ? 'required' : 'not required'} to attend`;
        }
        prompt += `\n`;
    }

    if (plea === 'Guilty') {
        const materials = getSelectedMaterials();
        if (materials) {
            prompt += `\nSENTENCE MATERIALS DISCUSSED: ${materials}\n`;
        }
    }

    const advoType = document.getElementById('advoType')?.value;
    if (advoType) {
        prompt += `\nADVO: ${advoType} for ${document.getElementById('pinop')?.value}`;
        prompt += ` (${document.getElementById('advoDuration')?.value})`;
        const conditions = getADVOConditions();
        prompt += `\nCONDITIONS: ${conditions}\n`;
    }

    if (document.getElementById('hasBail')?.value === 'Yes') {
        const bailConditions = getBailConditions();
        if (bailConditions) {
            prompt += `\nBAIL CONDITIONS: ${bailConditions}\n`;
        }
    }

    const additionalInfo = document.getElementById('additionalInfo')?.value;
    if (additionalInfo) {
        prompt += `\nADDITIONAL INFORMATION: ${additionalInfo}\n`;
    }

    return prompt;
};

const generateMentionPrompt = () => {
    const courtDate = document.getElementById('courtDate')?.value;
    const whoAppeared = document.getElementById('whoAppeared')?.value;
    const listedFor = document.getElementById('listedFor')?.value;
    const whatOccurred = document.getElementById('whatOccurred')?.value;
    const nextCourtDate = document.getElementById('nextCourtDate')?.value;
    const nextListedFor = document.getElementById('nextListedFor')?.value;
    const requiredAttend = document.getElementById('requiredAttend')?.value;

    let prompt = `Using the Mention Letter template, draft a letter with this information:\n\n`;
    prompt += `CLIENT: ${currentClient.name}\n`;
    prompt += `ADDRESS: ${currentClient.address || 'Not provided'}\n`;
    prompt += `MATTER REF: ${currentClient.matterNumber}\n\n`;

    prompt += `COURT: ${currentClient.court}\n`;
    prompt += `Date of appearance: ${formatDate(courtDate)}\n`;
    prompt += `Listed for: ${listedFor}\n`;
    prompt += `Who appeared: ${whoAppeared}\n\n`;

    prompt += `WHAT OCCURRED: ${whatOccurred}\n\n`;

    if (nextCourtDate) {
        prompt += `NEXT DATE: ${formatDate(nextCourtDate)}`;
        if (nextListedFor) {
            prompt += ` for ${nextListedFor}`;
        }
        prompt += `\n`;
        if (requiredAttend) {
            prompt += `Client ${requiredAttend === 'Yes' ? 'required' : 'not required'} to attend\n`;
        }
    }

    const interimInvoice = document.getElementById('interimInvoice')?.value;
    if (interimInvoice) {
        const status = document.getElementById('invoiceStatus')?.value;
        prompt += `\nInterim invoice amount: ${interimInvoice}`;
        if (status) {
            prompt += ` (${status.toLowerCase()})`;
        }
        prompt += `\n`;
    }

    const additionalInfo = document.getElementById('additionalInfo')?.value;
    if (additionalInfo) {
        prompt += `\nADDITIONAL INFORMATION: ${additionalInfo}\n`;
    }

    return prompt;
};

const generateFinalPrompt = () => {
    const courtDate = document.getElementById('courtDate')?.value;
    const finalListedFor = document.getElementById('finalListedFor')?.value;
    const whoAppeared = document.getElementById('whoAppeared')?.value;
    const outcome = document.getElementById('outcome')?.value;
    const penalty = document.getElementById('penalty')?.value;
    const penaltyLength = document.getElementById('penaltyLength')?.value;
    const appealProspects = document.getElementById('appealProspects')?.value;

    let prompt = `Using the Final Letter template, draft a letter with this information:\n\n`;
    prompt += `CLIENT: ${currentClient.name}\n`;
    prompt += `ADDRESS: ${currentClient.address || 'Not provided'}\n`;
    prompt += `MATTER REF: ${currentClient.matterNumber}\n\n`;

    prompt += `COURT: ${currentClient.court}\n`;
    prompt += `Date: ${formatDate(courtDate)}\n`;
    prompt += `Matter was listed for: ${finalListedFor}\n\n`;

    prompt += `CHARGES: ${currentClient.charges}\n\n`;

    if (whoAppeared === 'Counsel appeared') {
        prompt += `REPRESENTATION: Counsel appeared (need name)\n`;
    } else {
        prompt += `REPRESENTATION: I appeared\n`;
    }

    prompt += `\nOUTCOME: ${outcome}\n`;

    if (penalty) {
        prompt += `\nPENALTY: ${penalty}`;
        if (penaltyLength) {
            prompt += ` - ${penaltyLength}`;
        }
        prompt += `\n`;

        const conditions = document.getElementById('penaltyConditions')?.value;
        if (conditions) {
            prompt += `CONDITIONS: ${conditions}\n`;
        }
    }

    const license = document.getElementById('licenseDisqualification')?.value;
    if (license) {
        prompt += `\nLICENSE DISQUALIFICATION: ${license}\n`;
        const interlock = document.getElementById('interlockOrder')?.value;
        if (interlock) {
            prompt += `INTERLOCK ORDER: ${interlock}\n`;
        }
    }

    if (document.getElementById('finalADVO')?.value === 'Yes') {
        const pinop = document.getElementById('pinop')?.value;
        const duration = document.getElementById('advoDuration')?.value;
        const conditions = getFinalADVOConditions();
        prompt += `\nADVO made final for ${pinop} (${duration})\n`;
        prompt += `CONDITIONS: ${conditions}\n`;
    }

    prompt += `\nAPPEAL PROSPECTS: ${appealProspects}\n`;

    if (currentClient.legalAid) {
        prompt += `\nLEGAL AID MATTER`;
        if (currentClient.contribution) {
            prompt += ` - Outstanding contribution: ${currentClient.contribution}`;
        }
    } else {
        const finalInvoice = document.getElementById('finalInvoiceAmount')?.value;
        const outstanding = document.getElementById('outstandingAmount')?.value;
        prompt += `\nPRIVATE MATTER`;
        if (finalInvoice) {
            prompt += ` - Final invoice: ${finalInvoice}`;
        }
        if (outstanding) {
            prompt += ` - Outstanding: ${outstanding}`;
        }
    }

    const additionalInfo = document.getElementById('additionalInfo')?.value;
    if (additionalInfo) {
        prompt += `\n\nADDITIONAL INFORMATION: ${additionalInfo}\n`;
    }

    return prompt;
};

const generateFeeReestimatePrompt = () => {
    const conferenceDate = document.getElementById('conferenceDate')?.value;
    const conferenceType = document.getElementById('conferenceType')?.value;
    const originalEstimate = document.getElementById('originalEstimate')?.value;
    const additionalAmount = document.getElementById('additionalAmount')?.value;
    const reasonIncrease = document.getElementById('reasonIncrease')?.value;
    const nextCourtDate = document.getElementById('nextCourtDate')?.value;
    const nextListedFor = document.getElementById('nextListedFor')?.value;

    let prompt = `Using the Fee Re-estimate Letter template, draft a letter with this information:\n\n`;
    prompt += `CLIENT: ${currentClient.name}\n`;
    prompt += `ADDRESS: ${currentClient.address || 'Not provided'}\n`;
    prompt += `MATTER REF: ${currentClient.matterNumber}\n\n`;

    prompt += `Conference date: ${formatDate(conferenceDate)}\n`;
    prompt += `Conference type: ${conferenceType}\n\n`;

    prompt += `COURT: ${currentClient.court}\n`;

    if (nextCourtDate) {
        prompt += `Next court date: ${formatDate(nextCourtDate)}`;
        if (nextListedFor) {
            prompt += ` for ${nextListedFor}`;
        }
        prompt += `\n`;
    }

    const total = (parseFloat(originalEstimate) || 0) + (parseFloat(additionalAmount) || 0);
    prompt += `\nOriginal estimate: ${originalEstimate}\n`;
    prompt += `Additional amount: ${additionalAmount}\n`;
    prompt += `New total estimate: ${total}\n`;
    prompt += `Reason for increase: ${reasonIncrease}\n`;

    const progress = document.getElementById('matterProgress')?.value;
    if (progress) {
        prompt += `\nMatter progress: ${progress}\n`;
    }

    const interimAmount = document.getElementById('interimInvoiceAmount')?.value;
    if (interimAmount) {
        const status = document.getElementById('interimStatus')?.value;
        prompt += `\nInterim invoice: ${interimAmount}`;
        if (status) {
            prompt += ` - ${status}`;
        }
        prompt += `\n`;
    }

    const trustDeposit = document.getElementById('trustDeposit')?.value;
    if (trustDeposit) {
        prompt += `Trust deposit required: ${trustDeposit}\n`;
    }

    if (currentClient.matterType?.includes('Criminal')) {
        prompt += `\nNote: This is a criminal matter (use criminal variable list in paragraph 27)\n`;
    }

    const additionalInfo = document.getElementById('additionalInfo')?.value;
    if (additionalInfo) {
        prompt += `\nADDITIONAL INFORMATION: ${additionalInfo}\n`;
    }

    return prompt;
};

const getSelectedCharges = () => {
    const charges = [];

    if (currentClient && currentClient.charges) {
        charges.push(currentClient.charges);
    }

    document.querySelectorAll('input[type="checkbox"][id^="charge_"]:checked').forEach(cb => {
        charges.push(cb.value);
    });

    const additional = document.getElementById('additionalCharges')?.value;
    if (additional) charges.push(additional);

    let allCharges = charges.join(', ');

    const counts = document.getElementById('counts')?.value;
    if (counts && counts > 1) {
        allCharges += ` (${counts} counts)`;
    }

    return allCharges || 'No charges specified';
};

const getSelectedMaterials = () => {
    const materials = [];
    document.querySelectorAll('input[type="checkbox"][id^="mat_"]:checked').forEach(cb => {
        materials.push(cb.value);
    });
    return materials.join(', ');
};

const getADVOConditions = () => {
    const conditions = ['1 (mandatory)'];
    document.querySelectorAll('input[type="checkbox"][id^="advo_"]:checked').forEach(cb => {
        conditions.push(cb.value);
    });
    return conditions.join(', ');
};

const getFinalADVOConditions = () => {
    const conditions = ['1 (mandatory)'];
    document.querySelectorAll('input[type="checkbox"][id^="final_advo_"]:checked').forEach(cb => {
        conditions.push(cb.value);
    });
    return conditions.join(', ');
};

const getBailConditions = () => {
    const select = document.getElementById('bailConditions');
    if (!select) return '';
    const selected = Array.from(select.selectedOptions).map(opt => opt.value);

    const additional = document.getElementById('additionalBail')?.value;
    if (additional) selected.push(additional);

    return selected.join(', ');
};
        const getCCLFields = () => {
            return `
                <div class="section">
                    <div class="section-title">Contact Details</div>

                    <div class="form-group">
                        <label for="contactMethod">Contact Method*</label>
                        <select id="contactMethod" required>
                            <option value="">Select Contact Method</option>
                            <option value="Office attendance">Office attendance</option>
                            <option value="Phone call">Phone call</option>
                            <option value="Email">Email</option>
                            <option value="Police station">Police station</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="contactDate">Contact Date*</label>
                        <input type="date" id="contactDate" value="${getTodayDate()}" required>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Charges</div>

                    <div class="form-group" style="background: #f0f9ff; padding: 10px; border-radius: 6px; margin-bottom: 15px;">
                        <label style="font-weight: 600; color: #0284c7;">Charges from Database:</label>
                        <div style="padding: 8px; background: white; border-radius: 4px; border: 1px solid #e2e8f0;">
                            ${currentClient && currentClient.charges ? currentClient.charges : 'No charges loaded from database'}
                        </div>
                    </div>

                    <p style="font-size: 14px; color: #64748b; margin-bottom: 15px;">
                        Select additional charges or modify the existing charges below:
                    </p>

                    <div class="charges-section">
                        <div class="charges-category">
                            <h4>Violence Offences</h4>
                            <div class="checkbox-group">
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_affray" value="Affray - s93C Crimes Act">
                                    <label for="charge_affray">Affray - s93C Crimes Act</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_assault" value="Common Assault - s61 Crimes Act">
                                    <label for="charge_assault">Common Assault - s61 Crimes Act</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_abh" value="Assault occasioning ABH - s59 Crimes Act">
                                    <label for="charge_abh">Assault occasioning ABH - s59</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_assault_police" value="Assault Police - s60 Crimes Act">
                                    <label for="charge_assault_police">Assault Police - s60 Crimes Act</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_resist" value="Resist Officer - s58 Crimes Act">
                                    <label for="charge_resist">Resist Officer - s58 Crimes Act</label>
                                </div>
                            </div>
                        </div>

                        <div class="charges-category">
                            <h4>Domestic Violence</h4>
                            <div class="checkbox-group">
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_breach_avo" value="Breach AVO - s14 CDPV Act">
                                    <label for="charge_breach_avo">Breach AVO - s14 CDPV Act</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_stalk" value="Stalk/Intimidate - s13 CDPV Act">
                                    <label for="charge_stalk">Stalk/Intimidate - s13 CDPV Act</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_destroy" value="Destroy/Damage Property - s195 Crimes Act">
                                    <label for="charge_destroy">Destroy/Damage Property - s195</label>
                                </div>
                            </div>
                        </div>

                        <div class="charges-category">
                            <h4>Traffic Offences</h4>
                            <div class="checkbox-group">
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_low_pca" value="Low Range PCA - s110(3) Road Transport Act">
                                    <label for="charge_low_pca">Low Range PCA - s110(3)</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_mid_pca" value="Mid Range PCA - s110(4) Road Transport Act">
                                    <label for="charge_mid_pca">Mid Range PCA - s110(4)</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_high_pca" value="High Range PCA - s110(5) Road Transport Act">
                                    <label for="charge_high_pca">High Range PCA - s110(5)</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_disqualified" value="Drive whilst disqualified - s54(1) Road Transport Act">
                                    <label for="charge_disqualified">Drive whilst disqualified - s54(1)</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_suspended" value="Drive whilst suspended - s54(1) Road Transport Act">
                                    <label for="charge_suspended">Drive whilst suspended - s54(1)</label>
                                </div>
                            </div>
                        </div>

                        <div class="charges-category">
                            <h4>Drug Offences</h4>
                            <div class="checkbox-group">
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_possess" value="Possess Prohibited Drug - s10 DMTA">
                                    <label for="charge_possess">Possess Prohibited Drug - s10</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_supply" value="Supply Prohibited Drug - s25 DMTA">
                                    <label for="charge_supply">Supply Prohibited Drug - s25</label>
                                </div>
                            </div>
                        </div>

                        <div class="charges-category">
                            <h4>Property Offences</h4>
                            <div class="checkbox-group">
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_larceny" value="Larceny - s117 Crimes Act">
                                    <label for="charge_larceny">Larceny - s117 Crimes Act</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="charge_goods" value="Goods in Custody - s527C Crimes Act">
                                    <label for="charge_goods">Goods in Custody - s527C</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="additionalCharges">Additional Charges</label>
                        <input type="text" id="additionalCharges" placeholder="Enter any additional charges">
                    </div>

                    <div class="form-group">
                        <label for="counts">Number of Counts</label>
                        <input type="number" id="counts" min="1" placeholder="e.g., 3">
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Legal Aid & Fees</div>

                    <div class="form-group">
                        <label for="legalAidStatus">Legal Aid?*</label>
                        <select id="legalAidStatus" onchange="toggleLegalAidFields()" required>
                            <option value="">Select</option>
                            <option value="Yes" ${currentClient && currentClient.legalAid ? 'selected' : ''}>Yes</option>
                            <option value="No" ${currentClient && !currentClient.legalAid ? 'selected' : ''}>No</option>
                        </select>
                    </div>

                    <div class="conditional" id="legalAidDetails">
                        <div class="form-group">
                            <label for="contribution">Contribution Amount ($)</label>
                            <input type="number" id="contribution" placeholder="Leave blank if no contribution">
                        </div>
                    </div>

                    <div class="conditional" id="privateDetails">
                        <div class="form-group">
                            <label for="estimate">Estimate Amount ($)*</label>
                            <input type="number" id="estimate" placeholder="e.g., 3500">
                        </div>
                        <div class="form-group">
                            <label for="depositPaid">Deposit Paid?</label>
                            <select id="depositPaid" onchange="toggleDepositAmount()">
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>
                        <div class="conditional" id="depositDetails">
                            <div class="form-group">
                                <label for="depositAmount">Deposit Amount ($)</label>
                                <input type="number" id="depositAmount" placeholder="e.g., 1000">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Instructions</div>

                    <div class="form-group">
                        <label for="plea">Plea*</label>
                        <select id="plea" onchange="togglePleaOptions()" required>
                            <option value="">Select Plea</option>
                            <option value="Guilty">Guilty</option>
                            <option value="Not Guilty">Not Guilty</option>
                            ${currentClient && currentClient.matterType === 'Criminal - Indictable' ? '<option value="No plea yet (indictable)">No plea yet (indictable)</option>' : ''}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="clientInstructions">Client Instructions*</label>
                        <textarea id="clientInstructions" placeholder="What are the client's instructions moving forward?" required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="nextCourtDate">Next Court Date</label>
                        <input type="date" id="nextCourtDate" value="${currentClient && currentClient.nextCourt ? currentClient.nextCourt : ''}">
                    </div>

                    <div class="form-group">
                        <label for="requiredAttend">Client Required to Attend?</label>
                        <select id="requiredAttend">
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div class="conditional" id="sentenceMaterials">
                        <label>Sentence Materials Discussed</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="mat_references" value="Character references">
                                <label for="mat_references">Character references</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="mat_psych_existing" value="Psych report - existing doctor">
                                <label for="mat_psych_existing">Psych report - existing doctor</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="mat_psych_referral" value="Psych report - need referral">
                                <label for="mat_psych_referral">Psych report - need referral</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="mat_traffic" value="Traffic Offenders Program">
                                <label for="mat_traffic">Traffic Offenders Program</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="mat_treatment" value="Drug/Alcohol treatment">
                                <label for="mat_treatment">Drug/Alcohol treatment</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="mat_other" value="Other treatment proof">
                                <label for="mat_other">Other treatment proof</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">ADVO Details</div>

                    <div class="form-group">
                        <label for="advoType">ADVO Type</label>
                        <select id="advoType" onchange="toggleADVOFields()">
                            <option value="">No ADVO</option>
                            <option value="Provisional">Provisional</option>
                            <option value="Interim">Interim</option>
                            <option value="Final">Final</option>
                        </select>
                    </div>

                    <div class="conditional" id="advoDetails">
                        <div class="form-group">
                            <label for="pinop">PINOP Name*</label>
                            <input type="text" id="pinop" placeholder="Protected person's name">
                        </div>

                        <div class="form-group">
                            <label for="advoDuration">Duration*</label>
                            <select id="advoDuration">
                                <option value="">Select Duration</option>
                                <option value="6 months">6 months</option>
                                <option value="12 months">12 months</option>
                                <option value="2 years">2 years</option>
                                <option value="5 years">5 years</option>
                                <option value="Indefinite">Indefinite</option>
                            </select>
                        </div>

                        <label>ADVO Conditions (1 is mandatory)</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_2" value="2">
                                <label for="advo_2">2 - No contact</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_3" value="3">
                                <label for="advo_3">3 - No approach schools/childcare</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_4" value="4">
                                <label for="advo_4">4 - No approach after alcohol/drugs</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_5" value="5">
                                <label for="advo_5">5 - Must not locate</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_6" value="6">
                                <label for="advo_6">6 - Contact through lawyer only</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_7" value="7">
                                <label for="advo_7">7 - Cannot live at same address</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_8" value="8">
                                <label for="advo_8">8 - Cannot go to residence/work</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_9" value="9">
                                <label for="advo_9">9 - Stay away specified metres</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_10" value="10">
                                <label for="advo_10">10 - No firearms/weapons</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="advo_11" value="11">
                                <label for="advo_11">11 - Other conditions</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Bail Conditions</div>

                    <div class="form-group">
                        <label for="hasBail">Has Bail Conditions?</label>
                        <select id="hasBail" onchange="toggleBailFields()">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>

                    <div class="conditional" id="bailDetails">
                        <label>Select Bail Conditions</label>
                        <select id="bailConditions" multiple class="multi-select">
                            <option value="Reside at specified address">Reside at specified address</option>
                            <option value="Report to police station daily">Report to police station daily</option>
                            <option value="Report to police station Monday, Wednesday, Friday">Report Mon/Wed/Fri</option>
                            <option value="Report to police station weekly">Report weekly</option>
                            <option value="Not to contact specified person">Not to contact specified person</option>
                            <option value="Not to contact prosecution witnesses">Not to contact witnesses</option>
                            <option value="Not to go within specified metres">Not to go within X metres</option>
                            <option value="Not to enter specified suburb">Not to enter suburb/location</option>
                            <option value="Not to leave New South Wales">Not to leave NSW</option>
                            <option value="Surrender passport">Surrender passport</option>
                            <option value="Curfew">Curfew</option>
                            <option value="Not to consume alcohol">Not to consume alcohol</option>
                            <option value="Not to consume illicit drugs">Not to consume drugs</option>
                            <option value="Not to enter licensed premises">Not to enter licensed premises</option>
                            <option value="Not to drive a motor vehicle">Not to drive</option>
                        </select>
                        <small>Hold Ctrl (or Cmd on Mac) to select multiple</small>

                        <div class="form-group" style="margin-top: 10px;">
                            <label for="additionalBail">Additional Bail Conditions</label>
                            <textarea id="additionalBail" placeholder="Any additional bail conditions"></textarea>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Additional Information</div>
                    <div class="form-group">
                        <label for="additionalInfo">Additional Information</label>
                        <textarea id="additionalInfo" placeholder="Any other relevant information for this letter"></textarea>
                    </div>
                </div>
            `;
        };

        const getMentionFields = () => {
            return `
                <div class="section">
                    <div class="section-title">Court Appearance Details</div>

                    <div class="form-group">
                        <label for="courtDate">Court Date*</label>
                        <input type="date" id="courtDate" required>
                    </div>

                    <div class="form-group">
                        <label for="whoAppeared">Who Appeared?*</label>
                        <select id="whoAppeared" required>
                            <option value="">Select</option>
                            <option value="I appeared">I appeared</option>
                            <option value="Our solicitor appeared">Our solicitor appeared</option>
                            <option value="Counsel appeared">Counsel appeared</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="listedFor">Listed For*</label>
                        <select id="listedFor" required>
                            <option value="">Select</option>
                            <option value="Mention">Mention</option>
                            <option value="Brief Status">Brief Status</option>
                            <option value="Charge Certification">Charge Certification</option>
                            <option value="Committal">Committal</option>
                            <option value="Case Conference Mention">Case Conference Mention</option>
                            <option value="Hearing">Hearing</option>
                            <option value="Sentence">Sentence</option>
                            <option value="Plea of Guilty">Plea of Guilty</option>
                            <option value="Representations">Representations</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="whatOccurred">What Occurred*</label>
                        <textarea id="whatOccurred" placeholder="Brief description of what happened at court" required></textarea>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Next Court Date</div>

                    <div class="form-group">
                        <label for="nextCourtDate">Next Court Date</label>
                        <input type="date" id="nextCourtDate">
                    </div>

                    <div class="form-group">
                        <label for="nextListedFor">Next Listed For</label>
                        <select id="nextListedFor">
                            <option value="">Select</option>
                            <option value="Mention">Mention</option>
                            <option value="Brief Status">Brief Status</option>
                            <option value="Charge Certification">Charge Certification</option>
                            <option value="Committal">Committal</option>
                            <option value="Case Conference Mention">Case Conference Mention</option>
                            <option value="Hearing">Hearing</option>
                            <option value="Sentence">Sentence</option>
                            <option value="Trial">Trial</option>
                            <option value="Section 14 Application">Section 14 Application</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="requiredAttend">Client Required to Attend?</label>
                        <select id="requiredAttend">
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Billing (if applicable)</div>

                    <div class="form-group">
                        <label for="interimInvoice">Interim Invoice Amount ($)</label>
                        <input type="number" id="interimInvoice" placeholder="Leave blank if not applicable">
                    </div>

                    <div class="form-group">
                        <label for="invoiceStatus">Invoice Status</label>
                        <select id="invoiceStatus">
                            <option value="">Not applicable</option>
                            <option value="Paid">Paid</option>
                            <option value="Outstanding">Outstanding</option>
                        </select>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Additional Information</div>
                    <div class="form-group">
                        <label for="additionalInfo">Additional Information</label>
                        <textarea id="additionalInfo" placeholder="Any other relevant information for this letter"></textarea>
                    </div>
                </div>
            `;
        };

        const getFinalFields = () => {
            return `
                <div class="section">
                    <div class="section-title">Final Court Appearance</div>

                    <div class="form-group">
                        <label for="courtDate">Court Date*</label>
                        <input type="date" id="courtDate" required>
                    </div>

                    <div class="form-group">
                        <label for="finalListedFor">Matter was Listed For*</label>
                        <select id="finalListedFor" required>
                            <option value="">Select</option>
                            <option value="Hearing">Hearing</option>
                            <option value="Sentence">Sentence</option>
                            <option value="Appeal">Appeal</option>
                            <option value="Trial">Trial</option>
                            <option value="Section 14 Application">Section 14 Application</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="whoAppeared">Who Appeared?*</label>
                        <select id="whoAppeared" required>
                            <option value="">Select</option>
                            <option value="I appeared">I appeared</option>
                            <option value="Counsel appeared">Counsel appeared</option>
                        </select>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Outcome</div>

                    <div class="form-group">
                        <label for="outcome">Outcome*</label>
                        <textarea id="outcome" placeholder="What was the outcome of the matter?" required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="penalty">Penalty/Sentence (if applicable)</label>
                        <select id="penalty" onchange="checkPenaltyType()">
                            <option value="">Select if applicable</option>
                            <option value="Dismissed without conviction - s10(1)(a)">Dismissed without conviction - s10(1)(a)</option>
                            <option value="Convicted, no further penalty - s10A">Convicted, no further penalty - s10A</option>
                            <option value="Fine">Fine</option>
                            <option value="CRO without conviction">CRO without conviction</option>
                            <option value="CRO with conviction">CRO with conviction</option>
                            <option value="CCO">Community Correction Order (CCO)</option>
                            <option value="ICO">Intensive Correction Order (ICO)</option>
                            <option value="Full time imprisonment">Full time imprisonment</option>
                            <option value="Not Guilty">Found Not Guilty</option>
                            <option value="Charges dismissed">Charges dismissed</option>
                        </select>
                    </div>

                    <div class="conditional" id="penaltyDetails">
                        <div class="form-group">
                            <label for="penaltyLength">Length/Amount</label>
                            <input type="text" id="penaltyLength" placeholder="e.g., $500 fine, 12 months CRO">
                        </div>

                        <div class="form-group" id="conditionsField" style="display: none;">
                            <label for="penaltyConditions">Conditions</label>
                            <textarea id="penaltyConditions" placeholder="List any conditions of the order"></textarea>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="licenseDisqualification">License Disqualification (if applicable)</label>
                        <input type="text" id="licenseDisqualification" placeholder="e.g., 6 months minimum, 12 months automatic">
                    </div>

                    <div class="form-group">
                        <label for="interlockOrder">Interlock Order (if applicable)</label>
                        <select id="interlockOrder">
                            <option value="">Not applicable</option>
                            <option value="12 months">12 months</option>
                            <option value="24 months">24 months</option>
                            <option value="48 months">48 months</option>
                        </select>
                    </div>
                </div>

                <div class="section" id="finalADVOSection">
                    <div class="section-title">Final ADVO (if applicable)</div>

                    <div class="form-group">
                        <label for="finalADVO">ADVO Made Final?</label>
                        <select id="finalADVO" onchange="toggleFinalADVO()">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>

                    <div class="conditional" id="finalADVODetails">
                        <div class="form-group">
                            <label for="pinop">PINOP Name*</label>
                            <input type="text" id="pinop" placeholder="Protected person's name">
                        </div>

                        <div class="form-group">
                            <label for="advoDuration">Duration*</label>
                            <select id="advoDuration">
                                <option value="">Select Duration</option>
                                <option value="6 months">6 months</option>
                                <option value="12 months">12 months</option>
                                <option value="2 years">2 years</option>
                                <option value="5 years">5 years</option>
                                <option value="Indefinite">Indefinite</option>
                            </select>
                        </div>

                        <label>ADVO Conditions</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="final_advo_2" value="2">
                                <label for="final_advo_2">2 - No contact</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="final_advo_3" value="3">
                                <label for="final_advo_3">3 - Schools/childcare</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="final_advo_4" value="4">
                                <label for="final_advo_4">4 - No alcohol/drugs</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="final_advo_5" value="5">
                                <label for="final_advo_5">5 - Must not locate</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="final_advo_6" value="6">
                                <label for="final_advo_6">6 - Lawyer only</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="final_advo_7" value="7">
                                <label for="final_advo_7">7 - Not same address</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="final_advo_8" value="8">
                                <label for="final_advo_8">8 - Not go to residence</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="final_advo_9" value="9">
                                <label for="final_advo_9">9 - Stay away metres</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="final_advo_10" value="10">
                                <label for="final_advo_10">10 - No weapons</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Appeal Information</div>

                    <div class="form-group">
                        <label for="appealProspects">Appeal Prospects*</label>
                        <select id="appealProspects" required>
                            <option value="">Select</option>
                            <option value="Strong">Strong prospects</option>
                            <option value="Reasonable">Reasonable prospects</option>
                            <option value="Limited">Limited prospects</option>
                            <option value="Poor">Poor prospects</option>
                        </select>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Billing</div>

                    <div class="form-group">
                        <label for="finalInvoiceAmount">Final Invoice Amount ($)</label>
                        <input type="number" id="finalInvoiceAmount" placeholder="Total amount for final invoice">
                    </div>

                    <div class="form-group">
                        <label for="outstandingAmount">Outstanding Amount ($)</label>
                        <input type="number" id="outstandingAmount" placeholder="Any amount still owing">
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Additional Information</div>
                    <div class="form-group">
                        <label for="additionalInfo">Additional Information</label>
                        <textarea id="additionalInfo" placeholder="Any other relevant information for this letter"></textarea>
                    </div>
                </div>
            `;
        };

        const getFeeReestimateFields = () => {
            return `
                <div class="section">
                    <div class="section-title">Conference Details</div>

                    <div class="form-group">
                        <label for="conferenceDate">Conference/Contact Date*</label>
                        <input type="date" id="conferenceDate" value="${getTodayDate()}" required>
                    </div>

                    <div class="form-group">
                        <label for="conferenceType">Conference Type*</label>
                        <select id="conferenceType" required>
                            <option value="">Select</option>
                            <option value="Office attendance">Office attendance</option>
                            <option value="Phone conference">Phone conference</option>
                            <option value="AVL conference">AVL conference</option>
                        </select>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Fee Information</div>

                    <div class="form-group">
                        <label for="originalEstimate">Original Estimate ($)*</label>
                        <input type="number" id="originalEstimate" placeholder="e.g., 3500" required>
                    </div>

                    <div class="form-group">
                        <label for="additionalAmount">Additional Amount ($)*</label>
                        <input type="number" id="additionalAmount" placeholder="e.g., 1500" required>
                    </div>

                    <div class="form-group">
                        <label>New Total Estimate: $<span id="totalEstimate">0</span></label>
                    </div>

                    <div class="form-group">
                        <label for="reasonIncrease">Reason for Increase*</label>
                        <textarea id="reasonIncrease" placeholder="Explain why fees have increased" required></textarea>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Matter Update</div>

                    <div class="form-group">
                        <label for="nextCourtDate">Next Court Date</label>
                        <input type="date" id="nextCourtDate">
                    </div>

                    <div class="form-group">
                        <label for="nextListedFor">Listed For</label>
                        <select id="nextListedFor">
                            <option value="">Select if applicable</option>
                            <option value="Mention">Mention</option>
                            <option value="Hearing">Hearing</option>
                            <option value="Sentence">Sentence</option>
                            <option value="Trial">Trial</option>
                            <option value="Committal">Committal</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="matterProgress">Matter Progress/What Has Occurred</label>
                        <textarea id="matterProgress" placeholder="Brief update on what has happened in the matter"></textarea>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Invoice Status</div>

                    <div class="form-group">
                        <label for="interimInvoiceAmount">Interim Invoice Amount ($)</label>
                        <input type="number" id="interimInvoiceAmount" placeholder="Amount of interim invoice">
                    </div>

                    <div class="form-group">
                        <label for="interimStatus">Interim Invoice Status</label>
                        <select id="interimStatus">
                            <option value="">Select</option>
                            <option value="Paid">Paid in full</option>
                            <option value="Outstanding">Outstanding</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="trustDeposit">Trust Deposit Required ($)</label>
                        <input type="number" id="trustDeposit" placeholder="Amount to be deposited in trust">
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Additional Information</div>
                    <div class="form-group">
                        <label for="additionalInfo">Additional Information</label>
                        <textarea id="additionalInfo" placeholder="Any other relevant information for this letter"></textarea>
                    </div>
                </div>
            `;
        };

        // ===== TOGGLE FUNCTIONS =====
