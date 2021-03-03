package com.hotelfinder;

import android.content.Context;
import android.content.res.AssetManager;

import com.couchbase.lite.CouchbaseLite;
import com.couchbase.lite.CouchbaseLiteException;
import com.couchbase.lite.Database;
import com.couchbase.lite.DatabaseConfiguration;
import com.couchbase.lite.FullTextIndex;
import com.couchbase.lite.FullTextIndexItem;
import com.couchbase.lite.IndexBuilder;
import com.couchbase.lite.LogDomain;
import com.couchbase.lite.LogLevel;

import java.io.File;
import java.io.IOException;

// tag::setup-database[]
public class DatabaseManager {


    private static String DB_NAME = "travel-sample";
    private static String DB_USER = "findDB";

    private static Database database;
    private static DatabaseManager instance = null;

    private DatabaseManager(Context context) {

        Database.log.getConsole().setDomains(LogDomain.ALL_DOMAINS);
        Database.log.getConsole().setLevel(LogLevel.DEBUG);

        File dbFile = new File(context.getFilesDir() + "/" + DB_USER, "travel-sample.cblite2");
        DatabaseConfiguration config = new DatabaseConfiguration();
        config.setDirectory(String.format("%s/%s", context.getFilesDir(), DB_USER));


        if (!dbFile.exists()) {
            AssetManager assetManager = context.getAssets();
            try {
                File path = new File(context.getFilesDir()+"");
                Utils.unzip(assetManager.open("travel-sample.cblite2.zip"),path);
                Database.copy(new File(context.getFilesDir(),"travel-sample.cblite2"), DB_NAME, config);
            }
            catch (IOException e) {
                e.printStackTrace();
            }
            catch (CouchbaseLiteException e) {
                e.printStackTrace();
            }

        }
        try {
            database = new Database(DB_NAME, config);
            this.createIndexes();
        } catch (CouchbaseLiteException e) {
            e.printStackTrace();
        }

    }

    private void createIndexes() {
        try {
            FullTextIndexItem item = FullTextIndexItem.property("description");
            FullTextIndex index = IndexBuilder.fullTextIndex(item);
            database.createIndex("descFTSIndex", index);
        } catch (CouchbaseLiteException e) {
            e.printStackTrace();
        }
    }

    public static DatabaseManager getSharedInstance(Context context) {
        if (instance == null) {
            CouchbaseLite.init(context);
            instance = new DatabaseManager(context);
        }
        return instance;
    }

    public static Database getDatabase() {
        if (instance == null) {
            try {
                throw new Exception("Must call getSharedInstance first");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return database;
    }

    public class ZipUtils {

    }
}
// end::setup-database[]