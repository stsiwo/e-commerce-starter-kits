//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.3.2 
// See <a href="https://javaee.github.io/jaxb-v2/">https://javaee.github.io/jaxb-v2/</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2021.06.05 at 02:03:09 PM PDT 
//


package com.iwaodev.infrastructure.shipping.schema.common;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.adapters.NormalizedStringAdapter;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;


/**
 * <p>Java class for CcDetailsType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="CcDetailsType"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;all&gt;
 *         &lt;element name="cc-type" type="{}CcType"/&gt;
 *         &lt;element name="cc-number" type="{}CcNumberType"/&gt;
 *         &lt;element name="cc-name" type="{}CcNameType"/&gt;
 *         &lt;element name="cc-expiry" type="{}CcExpiryType"/&gt;
 *         &lt;element name="cc-cvv" type="{}CcCvvType" minOccurs="0"/&gt;
 *         &lt;element name="cc-address-details" type="{}CcAddressDetailsType" minOccurs="0"/&gt;
 *       &lt;/all&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "CcDetailsType", propOrder = {

})
public class CcDetailsType {

    @XmlElement(name = "cc-type", required = true)
    @XmlSchemaType(name = "normalizedString")
    protected CcType ccType;
    @XmlElement(name = "cc-number", required = true)
    @XmlJavaTypeAdapter(NormalizedStringAdapter.class)
    @XmlSchemaType(name = "normalizedString")
    protected String ccNumber;
    @XmlElement(name = "cc-name", required = true)
    @XmlJavaTypeAdapter(NormalizedStringAdapter.class)
    @XmlSchemaType(name = "normalizedString")
    protected String ccName;
    @XmlElement(name = "cc-expiry", required = true)
    @XmlJavaTypeAdapter(NormalizedStringAdapter.class)
    @XmlSchemaType(name = "normalizedString")
    protected String ccExpiry;
    @XmlElement(name = "cc-cvv")
    @XmlJavaTypeAdapter(NormalizedStringAdapter.class)
    @XmlSchemaType(name = "normalizedString")
    protected String ccCvv;
    @XmlElement(name = "cc-address-details")
    protected CcAddressDetailsType ccAddressDetails;

    /**
     * Gets the value of the ccType property.
     * 
     * @return
     *     possible object is
     *     {@link CcType }
     *     
     */
    public CcType getCcType() {
        return ccType;
    }

    /**
     * Sets the value of the ccType property.
     * 
     * @param value
     *     allowed object is
     *     {@link CcType }
     *     
     */
    public void setCcType(CcType value) {
        this.ccType = value;
    }

    /**
     * Gets the value of the ccNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCcNumber() {
        return ccNumber;
    }

    /**
     * Sets the value of the ccNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCcNumber(String value) {
        this.ccNumber = value;
    }

    /**
     * Gets the value of the ccName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCcName() {
        return ccName;
    }

    /**
     * Sets the value of the ccName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCcName(String value) {
        this.ccName = value;
    }

    /**
     * Gets the value of the ccExpiry property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCcExpiry() {
        return ccExpiry;
    }

    /**
     * Sets the value of the ccExpiry property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCcExpiry(String value) {
        this.ccExpiry = value;
    }

    /**
     * Gets the value of the ccCvv property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCcCvv() {
        return ccCvv;
    }

    /**
     * Sets the value of the ccCvv property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCcCvv(String value) {
        this.ccCvv = value;
    }

    /**
     * Gets the value of the ccAddressDetails property.
     * 
     * @return
     *     possible object is
     *     {@link CcAddressDetailsType }
     *     
     */
    public CcAddressDetailsType getCcAddressDetails() {
        return ccAddressDetails;
    }

    /**
     * Sets the value of the ccAddressDetails property.
     * 
     * @param value
     *     allowed object is
     *     {@link CcAddressDetailsType }
     *     
     */
    public void setCcAddressDetails(CcAddressDetailsType value) {
        this.ccAddressDetails = value;
    }

}
