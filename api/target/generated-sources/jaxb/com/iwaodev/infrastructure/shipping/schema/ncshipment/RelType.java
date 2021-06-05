//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.3.2 
// See <a href="https://javaee.github.io/jaxb-v2/">https://javaee.github.io/jaxb-v2/</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2021.06.05 at 02:03:09 PM PDT 
//


package com.iwaodev.infrastructure.shipping.schema.ncshipment;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for RelType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="RelType"&gt;
 *   &lt;restriction base="{http://www.canadapost.ca/ws/ncshipment-v4}RelType"&gt;
 *     &lt;enumeration value="self"/&gt;
 *     &lt;enumeration value="details"/&gt;
 *     &lt;enumeration value="shipment"/&gt;
 *     &lt;enumeration value="receipt"/&gt;
 *     &lt;enumeration value="refund"/&gt;
 *     &lt;enumeration value="label"/&gt;
 *     &lt;enumeration value="codRemittanceLabel"/&gt;
 *     &lt;enumeration value="codRecordOfDelivery"/&gt;
 *     &lt;enumeration value="commercialInvoice"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "RelType")
@XmlEnum
public enum RelType {

    @XmlEnumValue("self")
    SELF("self"),
    @XmlEnumValue("details")
    DETAILS("details"),
    @XmlEnumValue("shipment")
    SHIPMENT("shipment"),
    @XmlEnumValue("receipt")
    RECEIPT("receipt"),
    @XmlEnumValue("refund")
    REFUND("refund"),
    @XmlEnumValue("label")
    LABEL("label"),
    @XmlEnumValue("codRemittanceLabel")
    COD_REMITTANCE_LABEL("codRemittanceLabel"),
    @XmlEnumValue("codRecordOfDelivery")
    COD_RECORD_OF_DELIVERY("codRecordOfDelivery"),
    @XmlEnumValue("commercialInvoice")
    COMMERCIAL_INVOICE("commercialInvoice");
    private final String value;

    RelType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static RelType fromValue(String v) {
        for (RelType c: RelType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
