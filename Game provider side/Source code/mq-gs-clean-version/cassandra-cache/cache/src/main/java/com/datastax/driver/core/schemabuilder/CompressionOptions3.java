package com.datastax.driver.core.schemabuilder;

import com.datastax.driver.core.schemabuilder.TableOptions.CompressionOptions;

/**
 * Use for Cassandra 3.x+
 */
public class CompressionOptions3 extends CompressionOptions {
    private Algorithm algorithm;

    public CompressionOptions3(Algorithm algorithm) {
        super(algorithm);
        this.algorithm = algorithm;
    }

    @Override
    public String build() {
        String superBuild = super.build();

        // MegaSpikePower because by some reason driver 3.5.11 does not have this change,
        // though this should be from Cassandra 3.
        // @see
        // https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/operations/opsConfigCompress.html
        // section 3

        if (Algorithm.NONE.equals(algorithm)) {
            return "{'enabled': false }";
        }

        String withClass = superBuild.replace("sstable_compression", "class");
        return new StringBuilder(withClass).insert(withClass.length() - 1,
                ", 'enabled' : true ").toString();
    }

}
